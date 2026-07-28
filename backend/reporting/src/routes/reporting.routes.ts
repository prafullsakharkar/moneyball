// Routes for Reporting Service

import { Router } from 'express';
import {
  ReportService,
  ReportTemplateService,
  ReportScheduleService,
  ReportLogService,
  ReportPermissionService
} from '../services/ReportingService';
import { Request, Response } from 'express';

const router = Router();
const reportService = new ReportService();
const templateService = new ReportTemplateService();
const scheduleService = new ReportScheduleService();
const logService = new ReportLogService();
const permissionService = new ReportPermissionService();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'reporting' });
});

// Reports endpoints
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const { reportType, status, page, limit } = req.query;
    const result = await reportService.getAllReports({
      reportType: reportType as any,
      status: status as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.reports, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ data: report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

router.post('/reports', async (req: Request, res: Response) => {
  try {
    const report = await reportService.createReport(req.body);
    res.status(201).json({ data: report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

router.put('/reports/:id', async (req: Request, res: Response) => {
  try {
    const report = await reportService.updateReport(req.params.id, req.body);
    res.json({ data: report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report' });
  }
});

router.delete('/reports/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await reportService.deleteReport(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

router.post('/reports/:id/generate', async (req: Request, res: Response) => {
  try {
    const report = await reportService.generateReport({
      reportId: req.params.id,
      ...req.body
    });
    res.json({ data: report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Report permissions endpoints
router.post('/reports/:reportId/permissions', async (req: Request, res: Response) => {
  try {
    const permission = await reportService.addReportPermission({
      reportId: req.params.reportId,
      ...req.body
    });
    res.status(201).json({ data: permission });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add permission' });
  }
});

router.get('/reports/:reportId/permissions', async (req: Request, res: Response) => {
  try {
    const permissions = await reportService.getReportPermissions(req.params.reportId);
    res.json({ data: permissions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

router.put('/reports/:reportId/permissions/:userId', async (req: Request, res: Response) => {
  try {
    const permission = await reportService.updateReportPermission(
      req.params.reportId,
      req.params.userId,
      req.body
    );
    res.json({ data: permission });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update permission' });
  }
});

router.delete('/reports/:reportId/permissions/:userId', async (req: Request, res: Response) => {
  try {
    const deleted = await reportService.deleteReportPermission(
      req.params.reportId,
      req.params.userId
    );
    if (!deleted) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete permission' });
  }
});

// Report templates endpoints
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const { reportType, isActive } = req.query;
    const templates = await templateService.getAllTemplates({
      reportType: reportType as any,
      isActive: isActive === 'true'
    });
    res.json({ data: templates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.get('/templates/:id', async (req: Request, res: Response) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ data: template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

router.post('/templates', async (req: Request, res: Response) => {
  try {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json({ data: template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template' });
  }
});

router.put('/templates/:id', async (req: Request, res: Response) => {
  try {
    const template = await templateService.updateTemplate(req.params.id, req.body);
    res.json({ data: template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.delete('/templates/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await templateService.deleteTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

router.post('/templates/:id/activate', async (req: Request, res: Response) => {
  try {
    const template = await templateService.activateTemplate(req.params.id);
    res.json({ data: template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate template' });
  }
});

router.post('/templates/:id/deactivate', async (req: Request, res: Response) => {
  try {
    const template = await templateService.deactivateTemplate(req.params.id);
    res.json({ data: template });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate template' });
  }
});

// Report schedules endpoints
router.get('/schedules', async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    const schedules = await scheduleService.getAllSchedules({
      isActive: isActive === 'true'
    });
    res.json({ data: schedules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

router.get('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

router.get('/reports/:reportId/schedules', async (req: Request, res: Response) => {
  try {
    const schedules = await scheduleService.getScheduleByReportId(req.params.reportId);
    res.json({ data: schedules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

router.post('/schedules', async (req: Request, res: Response) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

router.put('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

router.delete('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await scheduleService.deleteSchedule(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

router.post('/schedules/:id/activate', async (req: Request, res: Response) => {
  try {
    const schedule = await scheduleService.activateSchedule(req.params.id);
    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate schedule' });
  }
});

router.post('/schedules/:id/deactivate', async (req: Request, res: Response) => {
  try {
    const schedule = await scheduleService.deactivateSchedule(req.params.id);
    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate schedule' });
  }
});

// Report logs endpoints
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const { reportId, status, page, limit } = req.query;
    const result = await logService.getAllLogs({
      reportId: reportId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.logs, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

router.get('/logs/:id', async (req: Request, res: Response) => {
  try {
    const log = await logService.getLogById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

router.post('/logs', async (req: Request, res: Response) => {
  try {
    const log = await logService.createLog(req.body);
    res.status(201).json({ data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log' });
  }
});

router.put('/logs/:id', async (req: Request, res: Response) => {
  try {
    const log = await logService.updateLog(req.params.id, req.body);
    res.json({ data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update log' });
  }
});

router.delete('/logs/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await logService.deleteLog(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

export default router;
