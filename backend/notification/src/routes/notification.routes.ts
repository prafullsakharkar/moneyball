// Routes for Notification Service

import { Router } from 'express';
import {
  notificationService,
  notificationTemplateService,
  notificationPreferenceService,
  pushTokenService
} from '../services/NotificationService';
import {
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

const router = Router();

// Notification routes
router.get('/notifications', async (req, res) => {
  try {
    const { userId, status, notificationType, limit, offset } = req.query;
    const params: any = {};
    if (userId) params.userId = userId;
    if (status) params.status = status as NotificationStatus;
    if (notificationType) params.notificationType = notificationType as NotificationType;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await notificationService.getNotificationsByUser(
      params.userId,
      params
    );
    res.json({ success: true, data: result.notifications, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

router.get('/notifications/:id', async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notification' });
  }
});

router.post('/notifications', async (req, res) => {
  try {
    const input: NotificationCreateInput = req.body;
    const notification = await notificationService.createNotification(input);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create notification' });
  }
});

router.patch('/notifications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const notification = await notificationService.updateNotificationStatus(req.params.id, status);
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update notification status' });
  }
});

router.post('/notifications/:id/send', async (req, res) => {
  try {
    const { channel } = req.body;
    await notificationService.sendNotification(req.params.id, channel);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send notification' });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const deleted = await notificationService.deleteNotification(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete notification' });
  }
});

router.post('/notifications/mark-all-read', async (req, res) => {
  try {
    const { userId } = req.body;
    await notificationService.markAllNotificationsAsRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark notifications as read' });
  }
});

// Notification Template routes
router.get('/notification-templates', async (req, res) => {
  try {
    const templates = await notificationTemplateService.getActiveTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notification templates' });
  }
});

router.get('/notification-templates/:id', async (req, res) => {
  try {
    const template = await notificationTemplateService.getTemplateByName(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Notification template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notification template' });
  }
});

router.post('/notification-templates', async (req, res) => {
  try {
    const input: NotificationTemplateCreateInput = req.body;
    const template = await notificationTemplateService.createTemplate(input);
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create notification template' });
  }
});

router.put('/notification-templates/:id', async (req, res) => {
  try {
    const input: NotificationTemplateUpdateInput = req.body;
    const template = await notificationTemplateService.updateTemplate(req.params.id, input);
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update notification template' });
  }
});

router.delete('/notification-templates/:id', async (req, res) => {
  try {
    const deleted = await notificationTemplateService.deleteTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Notification template not found' });
    }
    res.json({ success: true, message: 'Notification template deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete notification template' });
  }
});

// Notification Preference routes
router.get('/notification-preferences', async (req, res) => {
  try {
    const { userId } = req.query;
    const preferences = await notificationPreferenceService.getPreferencesByUser(userId as string);
    res.json({ success: true, data: preferences });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notification preferences' });
  }
});

router.get('/notification-preferences/:id', async (req, res) => {
  try {
    const preference = await notificationPreferenceService.getPreference(
      req.params.id,
      req.query.notificationType as NotificationType,
      req.query.channel as NotificationChannel
    );
    if (!preference) {
      return res.status(404).json({ success: false, error: 'Notification preference not found' });
    }
    res.json({ success: true, data: preference });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notification preference' });
  }
});

router.post('/notification-preferences', async (req, res) => {
  try {
    const input: NotificationPreferenceCreateInput = req.body;
    const preference = await notificationPreferenceService.createPreference(input);
    res.status(201).json({ success: true, data: preference });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create notification preference' });
  }
});

router.put('/notification-preferences/:id', async (req, res) => {
  try {
    const input: NotificationPreferenceUpdateInput = req.body;
    const preference = await notificationPreferenceService.updatePreference(req.params.id, input);
    res.json({ success: true, data: preference });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update notification preference' });
  }
});

router.delete('/notification-preferences/:id', async (req, res) => {
  try {
    const deleted = await notificationPreferenceService.deletePreference(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Notification preference not found' });
    }
    res.json({ success: true, message: 'Notification preference deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete notification preference' });
  }
});

// Push Token routes
router.get('/push-tokens', async (req, res) => {
  try {
    const { userId } = req.query;
    const tokens = await pushTokenService.getPushTokensByUser(userId as string);
    res.json({ success: true, data: tokens });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch push tokens' });
  }
});

router.get('/push-tokens/:id', async (req, res) => {
  try {
    const token = await pushTokenService.getPushTokenById(req.params.id);
    if (!token) {
      return res.status(404).json({ success: false, error: 'Push token not found' });
    }
    res.json({ success: true, data: token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch push token' });
  }
});

router.post('/push-tokens', async (req, res) => {
  try {
    const input: PushTokenCreateInput = req.body;
    const token = await pushTokenService.createPushToken(input);
    res.status(201).json({ success: true, data: token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create push token' });
  }
});

router.put('/push-tokens/:id', async (req, res) => {
  try {
    const input: PushTokenUpdateInput = req.body;
    const token = await pushTokenService.updatePushToken(req.params.id, input);
    res.json({ success: true, data: token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update push token' });
  }
});

router.delete('/push-tokens/:id', async (req, res) => {
  try {
    const deleted = await pushTokenService.deletePushToken(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Push token not found' });
    }
    res.json({ success: true, message: 'Push token deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete push token' });
  }
});

router.post('/push-tokens/deactivate-all', async (req, res) => {
  try {
    const { userId } = req.body;
    await pushTokenService.deactivateAllTokens(userId);
    res.json({ success: true, message: 'All push tokens deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to deactivate push tokens' });
  }
});

export default router;
