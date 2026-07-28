// Routes for Admin Service

import { Router } from 'express';
import {
  AuditLogService,
  SystemSettingService,
  SystemLogService,
  CacheInvalidationService,
  ApiRateLimitService,
  MigrationService
} from '../services/AdminService';
import { Request, Response } from 'express';

const router = Router();
const auditLogService = new AuditLogService();
const settingService = new SystemSettingService();
const logService = new SystemLogService();
const cacheService = new CacheInvalidationService();
const rateLimitService = new ApiRateLimitService();
const migrationService = new MigrationService();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'admin' });
});

// Audit logs endpoints
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const { userId, entityType, startDate, endDate, page, limit } = req.query;
    const result = await auditLogService.getAllLogs({
      userId: userId as string,
      entityType: entityType as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.logs, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.get('/audit-logs/:id', async (req: Request, res: Response) => {
  try {
    const log = await auditLogService.getLogById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

router.get('/entities/:entityType/:entityId/audit-logs', async (req: Request, res: Response) => {
  try {
    const logs = await auditLogService.getLogsByEntity(req.params.entityType, req.params.entityId);
    res.json({ data: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entity audit logs' });
  }
});

// System settings endpoints
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await settingService.getAllSettings();
    res.json({ data: settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.get('/settings/:key', async (req: Request, res: Response) => {
  try {
    const setting = await settingService.getSettingByKey(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ data: setting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

router.get('/settings/:key/value', async (req: Request, res: Response) => {
  try {
    const value = await settingService.getSettingValue(req.params.key);
    res.json({ data: { value } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting value' });
  }
});

router.post('/settings', async (req: Request, res: Response) => {
  try {
    const setting = await settingService.createSetting(req.body);
    res.status(201).json({ data: setting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

router.put('/settings/:key', async (req: Request, res: Response) => {
  try {
    const setting = await settingService.updateSetting(req.params.key, req.body);
    res.json({ data: setting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

router.delete('/settings/:key', async (req: Request, res: Response) => {
  try {
    const deleted = await settingService.deleteSetting(req.params.key);
    if (!deleted) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

router.post('/settings/:key/lock', async (req: Request, res: Response) => {
  try {
    const setting = await settingService.lockSetting(req.params.key);
    res.json({ data: setting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to lock setting' });
  }
});

router.post('/settings/:key/unlock', async (req: Request, res: Response) => {
  try {
    const setting = await settingService.unlockSetting(req.params.key);
    res.json({ data: setting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlock setting' });
  }
});

// System logs endpoints
router.get('/system-logs', async (req: Request, res: Response) => {
  try {
    const { logLevel, logCategory, startDate, endDate, page, limit } = req.query;
    const result = await logService.getAllLogs({
      logLevel: logLevel as string,
      logCategory: logCategory as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.logs, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system logs' });
  }
});

router.get('/system-logs/:id', async (req: Request, res: Response) => {
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

router.post('/system-logs', async (req: Request, res: Response) => {
  try {
    const log = await logService.createLog(req.body);
    res.status(201).json({ data: log });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log' });
  }
});

router.get('/system-logs/errors', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await logService.getErrorLogs({
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json({ data: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch error logs' });
  }
});

// Cache invalidation endpoints
router.get('/cache-invalidation', async (req: Request, res: Response) => {
  try {
    const { cacheType, startDate, endDate } = req.query;
    const invalidations = await cacheService.getAllInvalidations({
      cacheType: cacheType as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json({ data: invalidations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cache invalidations' });
  }
});

router.post('/cache-invalidation', async (req: Request, res: Response) => {
  try {
    const invalidation = await cacheService.createInvalidation(req.body);
    res.status(201).json({ data: invalidation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cache invalidation' });
  }
});

router.post('/cache-invalidation/:cacheType/invalidate-all', async (req: Request, res: Response) => {
  try {
    await cacheService.invalidateAll(req.params.cacheType);
    res.json({ message: 'All cache entries invalidated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to invalidate cache' });
  }
});

// API rate limits endpoints
router.get('/rate-limits', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const topIPs = await rateLimitService.getTopRateLimitedIPs(parseInt(limit as string));
    res.json({ data: topIPs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rate limits' });
  }
});

router.post('/rate-limits', async (req: Request, res: Response) => {
  try {
    const rateLimit = await rateLimitService.incrementRateLimit(req.body);
    res.status(201).json({ data: rateLimit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment rate limit' });
  }
});

router.delete('/rate-limits/:ipAddress/:endpoint', async (req: Request, res: Response) => {
  try {
    const deleted = await rateLimitService.resetRateLimit(req.params.ipAddress, req.params.endpoint);
    if (!deleted) {
      return res.status(404).json({ error: 'Rate limit not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset rate limit' });
  }
});

// Migration endpoints
router.get('/migrations', async (req: Request, res: Response) => {
  try {
    const migrations = await migrationService.getAllMigrations();
    res.json({ data: migrations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch migrations' });
  }
});

router.post('/migrations', async (req: Request, res: Response) => {
  try {
    const migration = await migrationService.markMigrationAsExecuted(req.body.name);
    res.status(201).json({ data: migration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark migration' });
  }
});

export default router;
