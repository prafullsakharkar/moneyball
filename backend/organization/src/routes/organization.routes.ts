// Organization routes for Organization Service

import { Router } from 'express';
import { organizationService } from '../services/OrganizationService.js';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware to verify JWT token
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authorization header required'
      }
    });
  }

  const token = authHeader.substring(7);
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      }
    });
  }

  next();
};

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const result = await organizationService.getAllOrganizations(req.query as any);
    res.json({
      success: true,
      data: result.organizations,
      meta: result.meta
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const organization = await organizationService.getOrganizationById(req.params.id);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }

    res.json({
      success: true,
      data: organization
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Create organization
router.post('/', authenticate, async (req, res) => {
  try {
    const organization = await organizationService.createOrganization(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: organization,
      message: 'Organization created successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
});

// Update organization
router.put('/:id', authenticate, async (req, res) => {
  try {
    const organization = await organizationService.updateOrganization(req.params.id, req.body, req.user.id);
    res.json({
      success: true,
      data: organization,
      message: 'Organization updated successfully'
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  }
});

// Get organization hierarchy
router.get('/:id/hierarchy', async (req, res) => {
  try {
    const hierarchy = await organizationService.getOrganizationHierarchy(req.params.id);
    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Get organization venues
router.get('/:id/venues', async (req, res) => {
  try {
    const venues = await organizationService.getOrganizationVenues(req.params.id);
    res.json({
      success: true,
      data: venues
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Create venue
router.post('/:id/venues', authenticate, async (req, res) => {
  try {
    const venue = await organizationService.createVenue(req.params.id, req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: venue,
      message: 'Venue created successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
});

export default router;
