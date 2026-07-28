// Services for Reporting Service

import { pool } from '../config/database';
import * as crypto from 'crypto';
import {
  Report,
  ReportTemplate,
  ReportSchedule,
  ReportLog,
  ReportPermission,
  ReportCreateInput,
  ReportUpdateInput,
  ReportGenerateInput,
  ReportTemplateCreateInput,
  ReportTemplateUpdateInput,
  ReportScheduleCreateInput,
  ReportScheduleUpdateInput,
  ReportPermissionCreateInput,
  ReportPermissionUpdateInput,
  ReportType,
  ReportFormat,
  ReportStatus,
  ScheduleType,
  PermissionLevel
} from '../models/Reporting';

export class ReportService {
  async getAllReports(params?: {
    reportType?: ReportType;
    status?: ReportStatus;
    page?: number;
    limit?: number;
  }): Promise<{ reports: Report[]; total: number }> {
    const { reportType, status, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM reports
      ${reportType ? 'WHERE report_type = $1' : ''}
      ${status ? (reportType ? ' AND' : ' WHERE') + ' status = $' + (reportType ? 2 : 1) : ''}
      ORDER BY created_at DESC
      LIMIT $${reportType && status ? 3 : reportType || status ? 2 : 1}
      OFFSET $${reportType && status ? 4 : reportType || status ? 3 : 2}
    `;

    const values = [
      ...(reportType ? [reportType] : []),
      ...(status ? [status] : []),
      limit,
      offset
    ];

    const result = await pool.query(query, values);
    const countQuery = `
      SELECT COUNT(*) FROM reports
      ${reportType ? 'WHERE report_type = $1' : ''}
      ${status ? (reportType ? ' AND' : ' WHERE') + ' status = $' + (reportType ? 2 : 1) : ''}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);

    return {
      reports: result.rows,
      total
    };
  }

  async getReportById(id: string): Promise<Report | null> {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createReport(input: ReportCreateInput): Promise<Report> {
    const { name, description, reportType, reportFormat = ReportFormat.PDF, parameters, createdBy } = input;
    const query = `
      INSERT INTO reports (id, name, description, report_type, report_format, status, parameters, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      name,
      description || null,
      reportType,
      reportFormat,
      ReportStatus.Draft,
      JSON.stringify(parameters),
      createdBy
    ]);
    return result.rows[0];
  }

  async updateReport(id: string, input: ReportUpdateInput): Promise<Report> {
    const { name, description, status, parameters } = input;
    const query = `
      UPDATE reports
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          parameters = COALESCE($4::jsonb, parameters),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [
      name || undefined,
      description || undefined,
      status || undefined,
      parameters ? JSON.stringify(parameters) : undefined,
      id
    ]);
    return result.rows[0];
  }

  async deleteReport(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async generateReport(input: ReportGenerateInput): Promise<Report> {
    const { reportId, format, parameters } = input;
    
    // Update report status to generating
    await pool.query(
      'UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [ReportStatus.Generating, reportId]
    );

    try {
      // In a real implementation, this would generate the actual report
      // For now, we'll just update the status to completed
      const fileUrl = `/reports/${reportId}.${format || ReportFormat.PDF}`;
      
      await pool.query(
        `UPDATE reports 
         SET status = $1, generated_at = CURRENT_TIMESTAMP, file_url = $2, parameters = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4`,
        [ReportStatus.Completed, fileUrl, JSON.stringify(parameters || {}), reportId]
      );

      const result = await pool.query('SELECT * FROM reports WHERE id = $1', [reportId]);
      return result.rows[0];
    } catch (error) {
      await pool.query(
        'UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [ReportStatus.Failed, reportId]
      );
      throw error;
    }
  }

  async addReportPermission(input: ReportPermissionCreateInput): Promise<ReportPermission> {
    const { reportId, userId, permissionLevel } = input;
    const query = `
      INSERT INTO report_permissions (id, report_id, user_id, permission_level)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (report_id, user_id) DO UPDATE SET permission_level = $4
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      reportId,
      userId,
      permissionLevel
    ]);
    return result.rows[0];
  }

  async getReportPermissions(reportId: string): Promise<ReportPermission[]> {
    const result = await pool.query('SELECT * FROM report_permissions WHERE report_id = $1', [reportId]);
    return result.rows;
  }

  async updateReportPermission(reportId: string, userId: string, input: ReportPermissionUpdateInput): Promise<ReportPermission> {
    const { permissionLevel } = input;
    const query = `
      UPDATE report_permissions
      SET permission_level = $1, updated_at = CURRENT_TIMESTAMP
      WHERE report_id = $2 AND user_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [permissionLevel, reportId, userId]);
    return result.rows[0];
  }

  async deleteReportPermission(reportId: string, userId: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM report_permissions WHERE report_id = $1 AND user_id = $2 RETURNING id',
      [reportId, userId]
    );
    return result.rows.length > 0;
  }
}

export class ReportTemplateService {
  async getAllTemplates(params?: { reportType?: ReportType; isActive?: boolean }): Promise<ReportTemplate[]> {
    const { reportType, isActive } = params || {};
    let query = 'SELECT * FROM report_templates';
    const values: any[] = [];
    const conditions: string[] = [];

    if (reportType) {
      conditions.push('report_type = $' + (values.length + 1));
      values.push(reportType);
    }
    if (isActive !== undefined) {
      conditions.push('is_active = $' + (values.length + 1));
      values.push(isActive);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  async getTemplateById(id: string): Promise<ReportTemplate | null> {
    const result = await pool.query('SELECT * FROM report_templates WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createTemplate(input: ReportTemplateCreateInput): Promise<ReportTemplate> {
    const { name, description, reportType, templateType, templateContent, isActive = true } = input;
    const query = `
      INSERT INTO report_templates (id, name, description, report_type, template_type, template_content, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      name,
      description || null,
      reportType,
      templateType,
      templateContent,
      isActive
    ]);
    return result.rows[0];
  }

  async updateTemplate(id: string, input: ReportTemplateUpdateInput): Promise<ReportTemplate> {
    const { name, description, reportType, templateType, templateContent, isActive } = input;
    const query = `
      UPDATE report_templates
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          report_type = COALESCE($3, report_type),
          template_type = COALESCE($4, template_type),
          template_content = COALESCE($5, template_content),
          is_active = COALESCE($6, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      name || undefined,
      description || undefined,
      reportType || undefined,
      templateType || undefined,
      templateContent || undefined,
      isActive,
      id
    ]);
    return result.rows[0];
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM report_templates WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async activateTemplate(id: string): Promise<ReportTemplate> {
    const query = `
      UPDATE report_templates
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async deactivateTemplate(id: string): Promise<ReportTemplate> {
    const query = `
      UPDATE report_templates
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export class ReportScheduleService {
  async getAllSchedules(params?: { isActive?: boolean }): Promise<ReportSchedule[]> {
    const { isActive } = params || {};
    let query = 'SELECT * FROM report_schedules';
    const values: any[] = [];

    if (isActive !== undefined) {
      query += ' WHERE is_active = $1';
      values.push(isActive);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  async getScheduleById(id: string): Promise<ReportSchedule | null> {
    const result = await pool.query('SELECT * FROM report_schedules WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getScheduleByReportId(reportId: string): Promise<ReportSchedule[]> {
    const result = await pool.query('SELECT * FROM report_schedules WHERE report_id = $1', [reportId]);
    return result.rows;
  }

  async createSchedule(input: ReportScheduleCreateInput): Promise<ReportSchedule> {
    const { reportId, name, description, scheduleType, cronExpression, startDate, endDate, recipients, isActive = true } = input;
    const query = `
      INSERT INTO report_schedules (id, report_id, name, description, schedule_type, cron_expression, start_date, end_date, recipients, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      reportId,
      name,
      description || null,
      scheduleType,
      cronExpression || null,
      startDate,
      endDate || null,
      JSON.stringify(recipients),
      isActive
    ]);
    return result.rows[0];
  }

  async updateSchedule(id: string, input: ReportScheduleUpdateInput): Promise<ReportSchedule> {
    const { name, description, scheduleType, cronExpression, startDate, endDate, recipients, isActive } = input;
    const query = `
      UPDATE report_schedules
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          schedule_type = COALESCE($3, schedule_type),
          cron_expression = COALESCE($4, cron_expression),
          start_date = COALESCE($5, start_date),
          end_date = COALESCE($6, end_date),
          recipients = COALESCE($7::text[], recipients),
          is_active = COALESCE($8, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    const result = await pool.query(query, [
      name || undefined,
      description || undefined,
      scheduleType || undefined,
      cronExpression || undefined,
      startDate || undefined,
      endDate || undefined,
      recipients ? JSON.stringify(recipients) : undefined,
      isActive,
      id
    ]);
    return result.rows[0];
  }

  async deleteSchedule(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM report_schedules WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async activateSchedule(id: string): Promise<ReportSchedule> {
    const query = `
      UPDATE report_schedules
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async deactivateSchedule(id: string): Promise<ReportSchedule> {
    const query = `
      UPDATE report_schedules
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export class ReportLogService {
  async getAllLogs(params?: { reportId?: string; status?: string; page?: number; limit?: number }): Promise<{ logs: ReportLog[]; total: number }> {
    const { reportId, status, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM report_logs';
    const values: any[] = [];
    const conditions: string[] = [];

    if (reportId) {
      conditions.push('report_id = $' + (values.length + 1));
      values.push(reportId);
    }
    if (status) {
      conditions.push('status = $' + (values.length + 1));
      values.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY started_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const result = await pool.query(query, values);
    const countQuery = `
      SELECT COUNT(*) FROM report_logs
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);

    return {
      logs: result.rows,
      total
    };
  }

  async getLogById(id: string): Promise<ReportLog | null> {
    const result = await pool.query('SELECT * FROM report_logs WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createLog(input: Partial<ReportLog>): Promise<ReportLog> {
    const { reportId, scheduledId, status, startedAt, completedAt, errorMessage, fileUrl } = input;
    const query = `
      INSERT INTO report_logs (id, report_id, scheduled_id, status, started_at, completed_at, error_message, file_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      reportId,
      scheduledId || null,
      status,
      startedAt || new Date().toISOString(),
      completedAt || null,
      errorMessage || null,
      fileUrl || null
    ]);
    return result.rows[0];
  }

  async updateLog(id: string, input: Partial<ReportLog>): Promise<ReportLog> {
    const { status, completedAt, errorMessage, fileUrl } = input;
    const query = `
      UPDATE report_logs
      SET status = COALESCE($1, status),
          completed_at = COALESCE($2, completed_at),
          error_message = COALESCE($3, error_message),
          file_url = COALESCE($4, file_url)
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [
      status || undefined,
      completedAt || undefined,
      errorMessage || undefined,
      fileUrl || undefined,
      id
    ]);
    return result.rows[0];
  }

  async deleteLog(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM report_logs WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}

export class ReportPermissionService {
  async getAllPermissions(params?: { reportId?: string; userId?: string }): Promise<ReportPermission[]> {
    const { reportId, userId } = params || {};
    let query = 'SELECT * FROM report_permissions';
    const values: any[] = [];
    const conditions: string[] = [];

    if (reportId) {
      conditions.push('report_id = $' + (values.length + 1));
      values.push(reportId);
    }
    if (userId) {
      conditions.push('user_id = $' + (values.length + 1));
      values.push(userId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getPermission(reportId: string, userId: string): Promise<ReportPermission | null> {
    const result = await pool.query(
      'SELECT * FROM report_permissions WHERE report_id = $1 AND user_id = $2',
      [reportId, userId]
    );
    return result.rows[0] || null;
  }

  async createPermission(input: ReportPermissionCreateInput): Promise<ReportPermission> {
    const { reportId, userId, permissionLevel } = input;
    const query = `
      INSERT INTO report_permissions (id, report_id, user_id, permission_level)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (report_id, user_id) DO UPDATE SET permission_level = $4, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      reportId,
      userId,
      permissionLevel
    ]);
    return result.rows[0];
  }

  async updatePermission(reportId: string, userId: string, input: ReportPermissionUpdateInput): Promise<ReportPermission> {
    const { permissionLevel } = input;
    const query = `
      UPDATE report_permissions
      SET permission_level = $1, updated_at = CURRENT_TIMESTAMP
      WHERE report_id = $2 AND user_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [permissionLevel, reportId, userId]);
    return result.rows[0];
  }

  async deletePermission(reportId: string, userId: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM report_permissions WHERE report_id = $1 AND user_id = $2 RETURNING id',
      [reportId, userId]
    );
    return result.rows.length > 0;
  }
}
