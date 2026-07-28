// Notification Service with CRUD operations and notification management

import { pool } from '../config/database';
import {
  Notification,
  NotificationTemplate,
  NotificationPreference,
  NotificationSentHistory,
  PushToken,
  NotificationCreateInput,
  NotificationUpdateInput,
  NotificationTemplateCreateInput,
  NotificationTemplateUpdateInput,
  NotificationPreferenceCreateInput,
  NotificationPreferenceUpdateInput,
  PushTokenCreateInput,
  PushTokenUpdateInput,
  NotificationType,
  Priority,
  NotificationStatus,
  NotificationChannel,
  SendStatus,
  DeviceType
} from '../models/Notification';

// Notification Service
export class NotificationService {
  // Get notifications by user
  async getNotificationsByUser(
    userId: string,
    params?: { status?: NotificationStatus; notificationType?: NotificationType; limit?: number; offset?: number }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const client = await pool.connect();
    try {
      const { status, notificationType, limit = 10, offset = 0 } = params || {};
      const values: any[] = [userId];
      let paramIndex = 2;

      const conditions: string[] = ['user_id = $1'];
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }
      if (notificationType) {
        conditions.push(`notification_type = $${paramIndex++}`);
        values.push(notificationType);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM notifications WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM notifications WHERE ${whereClause}`,
        values
      );

      return {
        notifications: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get notification by ID
  async getNotificationById(id: string): Promise<Notification | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM notifications WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create notification
  async createNotification(input: NotificationCreateInput): Promise<Notification> {
    const client = await pool.connect();
    try {
      const {
        userId,
        notificationType,
        title,
        message,
        priority = 'Normal',
        actionUrl,
        metadata
      } = input;

      const result = await client.query(
        `
        INSERT INTO notifications (
          id, user_id, notification_type, title, message, priority, status,
          action_url, metadata
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, 'Unread', $6, $7
        )
        RETURNING *
        `,
        [userId, notificationType, title, message, priority, actionUrl, metadata ? JSON.stringify(metadata) : null]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update notification status
  async updateNotificationStatus(id: string, status: NotificationStatus): Promise<Notification> {
    const client = await pool.connect();
    try {
      const updates: string[] = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [status, id];

      if (status === 'Read') {
        updates.push('read_at = CURRENT_TIMESTAMP');
      }

      const query = `UPDATE notifications SET ${updates.join(', ')} WHERE id = $2 RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE notifications SET status = 'Read', read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND status = 'Unread'`,
        [userId]
      );
    } finally {
      client.release();
    }
  }

  // Delete notification
  async deleteNotification(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM notifications WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Send notification
  async sendNotification(notificationId: string, channel: NotificationChannel): Promise<void> {
    const client = await pool.connect();
    try {
      // Get notification
      const notificationResult = await client.query(
        'SELECT * FROM notifications WHERE id = $1',
        [notificationId]
      );
      const notification = notificationResult.rows[0];

      if (!notification) {
        throw new Error('Notification not found');
      }

      // Record sent history
      await client.query(
        `
        INSERT INTO notification_sent_history (
          id, notification_id, user_id, notification_type, channel, status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, 'Sent'
        )
        `,
        [notificationId, notification.user_id, notification.notification_type, channel]
      );

      // Update notification status
      await client.query(
        `UPDATE notifications SET status = 'Read', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [notificationId]
      );
    } finally {
      client.release();
    }
  }
}

// Notification Template Service
export class NotificationTemplateService {
  // Get all active templates
  async getActiveTemplates(): Promise<NotificationTemplate[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM notification_templates WHERE is_active = true'
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get template by name
  async getTemplateByName(templateName: string): Promise<NotificationTemplate | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM notification_templates WHERE template_name = $1',
        [templateName]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create template
  async createTemplate(input: NotificationTemplateCreateInput): Promise<NotificationTemplate> {
    const client = await pool.connect();
    try {
      const {
        templateName,
        notificationType,
        titleTemplate,
        messageTemplate,
        priority = 'Normal',
        isActive = true
      } = input;

      const result = await client.query(
        `
        INSERT INTO notification_templates (
          id, template_name, notification_type, title_template, message_template,
          priority, is_active
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6
        )
        RETURNING *
        `,
        [templateName, notificationType, titleTemplate, messageTemplate, priority, isActive]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update template
  async updateTemplate(id: string, input: NotificationTemplateUpdateInput): Promise<NotificationTemplate> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.titleTemplate) {
        updates.push(`title_template = $${paramIndex++}`);
        values.push(input.titleTemplate);
      }
      if (input.messageTemplate) {
        updates.push(`message_template = $${paramIndex++}`);
        values.push(input.messageTemplate);
      }
      if (input.priority) {
        updates.push(`priority = $${paramIndex++}`);
        values.push(input.priority);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM notification_templates WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE notification_templates SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete template
  async deleteTemplate(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM notification_templates WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Notification Preference Service
export class NotificationPreferenceService {
  // Get preferences by user
  async getPreferencesByUser(userId: string): Promise<NotificationPreference[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM notification_preferences WHERE user_id = $1',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get preference by user, type, and channel
  async getPreference(userId: string, notificationType: NotificationType, channel: NotificationChannel): Promise<NotificationPreference | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM notification_preferences WHERE user_id = $1 AND notification_type = $2 AND channel = $3',
        [userId, notificationType, channel]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create preference
  async createPreference(input: NotificationPreferenceCreateInput): Promise<NotificationPreference> {
    const client = await pool.connect();
    try {
      const { userId, notificationType, channel, isEnabled = true } = input;

      const result = await client.query(
        `
        INSERT INTO notification_preferences (
          id, user_id, notification_type, channel, is_enabled
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4
        )
        ON CONFLICT (user_id, notification_type, channel) DO UPDATE SET
          is_enabled = EXCLUDED.is_enabled,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [userId, notificationType, channel, isEnabled]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update preference
  async updatePreference(id: string, input: NotificationPreferenceUpdateInput): Promise<NotificationPreference> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.isEnabled !== undefined) {
        updates.push(`is_enabled = $${paramIndex++}`);
        values.push(input.isEnabled);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM notification_preferences WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE notification_preferences SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete preference
  async deletePreference(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM notification_preferences WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}

// Push Token Service
export class PushTokenService {
  // Get push tokens by user
  async getPushTokensByUser(userId: string): Promise<PushToken[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM push_tokens WHERE user_id = $1 AND is_active = true',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get push token by ID
  async getPushTokenById(id: string): Promise<PushToken | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM push_tokens WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create push token
  async createPushToken(input: PushTokenCreateInput): Promise<PushToken> {
    const client = await pool.connect();
    try {
      const {
        userId,
        token,
        deviceType,
        deviceName,
        isActive = true
      } = input;

      const result = await client.query(
        `
        INSERT INTO push_tokens (
          id, user_id, token, device_type, device_name, is_active
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5
        )
        ON CONFLICT (user_id, token) DO UPDATE SET
          device_name = EXCLUDED.device_name,
          is_active = EXCLUDED.is_active,
          last_used_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [userId, token, deviceType, deviceName, isActive]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update push token
  async updatePushToken(id: string, input: PushTokenUpdateInput): Promise<PushToken> {
    const client = await pool.connect();
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (input.deviceName) {
        updates.push(`device_name = $${paramIndex++}`);
        values.push(input.deviceName);
      }
      if (input.isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(input.isActive);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      if (updates.length === 1) {
        const result = await client.query('SELECT * FROM push_tokens WHERE id = $1', [id]);
        return result.rows[0];
      }

      values.push(id);
      const query = `UPDATE push_tokens SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete push token
  async deletePushToken(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM push_tokens WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Deactivate all tokens for user
  async deactivateAllTokens(userId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE push_tokens SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`,
        [userId]
      );
    } finally {
      client.release();
    }
  }
}

// Export all services
export const notificationService = new NotificationService();
export const notificationTemplateService = new NotificationTemplateService();
export const notificationPreferenceService = new NotificationPreferenceService();
export const pushTokenService = new PushTokenService();
