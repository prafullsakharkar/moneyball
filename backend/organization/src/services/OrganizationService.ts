// Organization Service for Organization Service

import { pool } from '../config/database.js';
import { generateId, getCurrentTimestamp } from '@shared/utils';
import { Organization, OrganizationCreateInput, OrganizationUpdateInput, Venue, VenueCreateInput, VenueUpdateInput } from '../models/index.js';

export class OrganizationService {
  // Get all organizations
  async getAllOrganizations(params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ organizations: Organization[]; meta: any }> {
    const client = await pool.connect();
    
    try {
      const { type, status, page = 1, limit = 10, search } = params || {};
      const offset = (page - 1) * limit;

      let query = `
        SELECT id, external_id, name, short_name, logo, description, organization_type, status, 
               website, email, phone, address, contact, social_media, settings, verified, 
               verified_at, verified_by, created_at, updated_at, created_by, updated_by
        FROM organizations
        WHERE 1=1
      `;
      const paramsArray: any[] = [];
      let paramIndex = 1;

      if (type) {
        query += ` AND organization_type = $${paramIndex}`;
        paramsArray.push(type);
        paramIndex++;
      }

      if (status) {
        query += ` AND status = $${paramIndex}`;
        paramsArray.push(status);
        paramIndex++;
      }

      if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR short_name ILIKE $${paramIndex})`;
        paramsArray.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      paramsArray.push(limit, offset);

      const result = await client.query(query, paramsArray);

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM organizations WHERE 1=1`;
      const countResult = await client.query(countQuery, paramsArray.slice(0, paramIndex - 2));

      const organizations = result.rows.map((row: any) => ({
        id: row.id,
        externalId: row.external_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        description: row.description,
        organizationType: row.organization_type,
        status: row.status,
        website: row.website,
        email: row.email,
        phone: row.phone,
        address: row.address,
        contact: row.contact,
        socialMedia: row.social_media,
        settings: row.settings,
        verified: row.verified,
        verifiedAt: row.verified_at,
        verifiedBy: row.verified_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      }));

      return {
        organizations,
        meta: {
          page,
          limit,
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
          hasMore: page * limit < parseInt(countResult.rows[0].count)
        }
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get organization by ID
  async getOrganizationById(id: string): Promise<Organization | null> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, external_id, name, short_name, logo, description, organization_type, status, 
                website, email, phone, address, contact, social_media, settings, verified, 
                verified_at, verified_by, created_at, updated_at, created_by, updated_by
         FROM organizations WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        description: row.description,
        organizationType: row.organization_type,
        status: row.status,
        website: row.website,
        email: row.email,
        phone: row.phone,
        address: row.address,
        contact: row.contact,
        socialMedia: row.social_media,
        settings: row.settings,
        verified: row.verified,
        verifiedAt: row.verified_at,
        verifiedBy: row.verified_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Create organization
  async createOrganization(input: OrganizationCreateInput, userId: string): Promise<Organization> {
    const client = await pool.connect();
    
    try {
      const orgId = generateId();

      const result = await client.query(
        `INSERT INTO organizations (id, name, short_name, logo, description, organization_type, 
                                     website, email, phone, address, contact, social_media, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id, external_id, name, short_name, logo, description, organization_type, status, 
                   website, email, phone, address, contact, social_media, settings, verified, 
                   verified_at, verified_by, created_at, updated_at, created_by, updated_by`,
        [orgId, input.name, input.shortName, input.logo, input.description, input.organizationType,
         input.website, input.email, input.phone, JSON.stringify(input.address), JSON.stringify(input.contact),
         JSON.stringify(input.socialMedia || {}), userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        description: row.description,
        organizationType: row.organization_type,
        status: row.status,
        website: row.website,
        email: row.email,
        phone: row.phone,
        address: row.address,
        contact: row.contact,
        socialMedia: row.social_media,
        settings: row.settings,
        verified: row.verified,
        verifiedAt: row.verified_at,
        verifiedBy: row.verified_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Update organization
  async updateOrganization(id: string, input: OrganizationUpdateInput, userId: string): Promise<Organization> {
    const client = await pool.connect();
    
    try {
      const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [userId, id];
      let paramIndex = 3;

      if (input.name) {
        updates.push(`name = $${paramIndex}`);
        values.push(input.name);
        paramIndex++;
      }

      if (input.shortName) {
        updates.push(`short_name = $${paramIndex}`);
        values.push(input.shortName);
        paramIndex++;
      }

      if (input.logo) {
        updates.push(`logo = $${paramIndex}`);
        values.push(input.logo);
        paramIndex++;
      }

      if (input.description) {
        updates.push(`description = $${paramIndex}`);
        values.push(input.description);
        paramIndex++;
      }

      if (input.website) {
        updates.push(`website = $${paramIndex}`);
        values.push(input.website);
        paramIndex++;
      }

      if (input.email) {
        updates.push(`email = $${paramIndex}`);
        values.push(input.email);
        paramIndex++;
      }

      if (input.phone) {
        updates.push(`phone = $${paramIndex}`);
        values.push(input.phone);
        paramIndex++;
      }

      if (input.address) {
        updates.push(`address = $${paramIndex}`);
        values.push(JSON.stringify(input.address));
        paramIndex++;
      }

      if (input.contact) {
        updates.push(`contact = $${paramIndex}`);
        values.push(JSON.stringify(input.contact));
        paramIndex++;
      }

      if (input.socialMedia) {
        updates.push(`social_media = $${paramIndex}`);
        values.push(JSON.stringify(input.socialMedia));
        paramIndex++;
      }

      if (input.settings) {
        updates.push(`settings = $${paramIndex}`);
        values.push(JSON.stringify(input.settings));
        paramIndex++;
      }

      const query = `
        UPDATE organizations 
        SET ${updates.join(', ')}, updated_by = $1
        WHERE id = $2
        RETURNING id, external_id, name, short_name, logo, description, organization_type, status, 
                  website, email, phone, address, contact, social_media, settings, verified, 
                  verified_at, verified_by, created_at, updated_at, created_by, updated_by
      `;

      const result = await client.query(query, values);

      const row = result.rows[0];
      return {
        id: row.id,
        externalId: row.external_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        description: row.description,
        organizationType: row.organization_type,
        status: row.status,
        website: row.website,
        email: row.email,
        phone: row.phone,
        address: row.address,
        contact: row.contact,
        socialMedia: row.social_media,
        settings: row.settings,
        verified: row.verified,
        verifiedAt: row.verified_at,
        verifiedBy: row.verified_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get organization hierarchy
  async getOrganizationHierarchy(organizationId: string): Promise<any[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT oh.id, oh.parent_id, oh.child_id, oh.relationship_type, oh.started_at, oh.ended_at,
                p.name as parent_name, c.name as child_name
         FROM organization_hierarchy oh
         JOIN organizations p ON oh.parent_id = p.id
         JOIN organizations c ON oh.child_id = c.id
         WHERE oh.parent_id = $1 OR oh.child_id = $1
         ORDER BY oh.started_at DESC`,
        [organizationId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Get organization venues
  async getOrganizationVenues(organizationId: string): Promise<Venue[]> {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, organization_id, name, short_name, logo, description, venue_type, capacity, 
                address, facilities, images, status, created_at, updated_at, created_by, updated_by
         FROM venues WHERE organization_id = $1 ORDER BY name`,
        [organizationId]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        description: row.description,
        venueType: row.venue_type,
        capacity: row.capacity,
        address: row.address,
        facilities: row.facilities,
        images: row.images,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      }));
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  // Create venue
  async createVenue(organizationId: string, input: VenueCreateInput, userId: string): Promise<Venue> {
    const client = await pool.connect();
    
    try {
      const venueId = generateId();

      const result = await client.query(
        `INSERT INTO venues (id, organization_id, name, short_name, logo, description, venue_type, 
                             capacity, address, facilities, images, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id, organization_id, name, short_name, logo, description, venue_type, capacity, 
                   address, facilities, images, status, created_at, updated_at, created_by, updated_by`,
        [venueId, organizationId, input.name, input.shortName, input.logo, input.description, input.venueType,
         input.capacity, JSON.stringify(input.address), JSON.stringify(input.facilities), JSON.stringify(input.images), userId]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        organizationId: row.organization_id,
        name: row.name,
        shortName: row.short_name,
        logo: row.logo,
        description: row.description,
        venueType: row.venue_type,
        capacity: row.capacity,
        address: row.address,
        facilities: row.facilities,
        images: row.images,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }
}

export const organizationService = new OrganizationService();
