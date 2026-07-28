// Services for Sponsorship Service

import { pool } from '../config/database';
import {
  Sponsor,
  SponsorshipPackage,
  SponsorshipDeal,
  DealPayment,
  SponsorshipAsset,
  SponsorCreateInput,
  SponsorUpdateInput,
  SponsorshipPackageCreateInput,
  SponsorshipPackageUpdateInput,
  SponsorshipDealCreateInput,
  SponsorshipDealUpdateInput,
  DealPaymentCreateInput,
  DealPaymentUpdateInput,
  SponsorshipAssetCreateInput,
  SponsorshipAssetUpdateInput,
  SponsorType,
  SponsorshipStatus,
  PaymentStatus,
  AssetType
} from '../models/Sponsorship';

export class SponsorService {
  async getAllSponsors(params?: {
    sponsorType?: SponsorType;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ sponsors: Sponsor[]; total: number }> {
    const { sponsorType, status, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM sponsors
      ${sponsorType ? 'WHERE sponsor_type = $1' : ''}
      ${status ? (sponsorType ? ' AND' : ' WHERE') + ' status = $' + (sponsorType ? 2 : 1) : ''}
      ORDER BY created_at DESC
      LIMIT $${sponsorType && status ? 3 : sponsorType || status ? 2 : 1}
      OFFSET $${sponsorType && status ? 4 : sponsorType || status ? 3 : 2}
    `;

    const values = [
      ...(sponsorType ? [sponsorType] : []),
      ...(status ? [status] : []),
      limit,
      offset
    ];

    const result = await pool.query(query, values);
    const countQuery = `
      SELECT COUNT(*) FROM sponsors
      ${sponsorType ? 'WHERE sponsor_type = $1' : ''}
      ${status ? (sponsorType ? ' AND' : ' WHERE') + ' status = $' + (sponsorType ? 2 : 1) : ''}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);

    return {
      sponsors: result.rows,
      total
    };
  }

  async getSponsorById(id: string): Promise<Sponsor | null> {
    const result = await pool.query('SELECT * FROM sponsors WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createSponsor(input: SponsorCreateInput): Promise<Sponsor> {
    const { name, description, sponsorType, logoUrl, websiteUrl, contactEmail, contactPhone, status = 'Active' } = input;
    const query = `
      INSERT INTO sponsors (id, name, description, sponsor_type, logo_url, website_url, contact_email, contact_phone, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      name,
      description || null,
      sponsorType,
      logoUrl || null,
      websiteUrl || null,
      contactEmail || null,
      contactPhone || null,
      status
    ]);
    return result.rows[0];
  }

  async updateSponsor(id: string, input: SponsorUpdateInput): Promise<Sponsor> {
    const { name, description, sponsorType, logoUrl, websiteUrl, contactEmail, contactPhone, status } = input;
    const query = `
      UPDATE sponsors
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          sponsor_type = COALESCE($3, sponsor_type),
          logo_url = COALESCE($4, logo_url),
          website_url = COALESCE($5, website_url),
          contact_email = COALESCE($6, contact_email),
          contact_phone = COALESCE($7, contact_phone),
          status = COALESCE($8, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    const result = await pool.query(query, [
      name || undefined,
      description || undefined,
      sponsorType || undefined,
      logoUrl || undefined,
      websiteUrl || undefined,
      contactEmail || undefined,
      contactPhone || undefined,
      status || undefined,
      id
    ]);
    return result.rows[0];
  }

  async deleteSponsor(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM sponsors WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async activateSponsor(id: string): Promise<Sponsor> {
    const query = `
      UPDATE sponsors
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, ['Active', id]);
    return result.rows[0];
  }

  async deactivateSponsor(id: string): Promise<Sponsor> {
    const query = `
      UPDATE sponsors
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, ['Inactive', id]);
    return result.rows[0];
  }
}

export class SponsorshipPackageService {
  async getAllPackages(params?: { sponsorId?: string; isActive?: boolean }): Promise<SponsorshipPackage[]> {
    const { sponsorId, isActive } = params || {};
    let query = 'SELECT * FROM sponsorship_packages';
    const values: any[] = [];
    const conditions: string[] = [];

    if (sponsorId) {
      conditions.push('sponsor_id = $' + (values.length + 1));
      values.push(sponsorId);
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

  async getPackageById(id: string): Promise<SponsorshipPackage | null> {
    const result = await pool.query('SELECT * FROM sponsorship_packages WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createPackage(input: SponsorshipPackageCreateInput): Promise<SponsorshipPackage> {
    const { name, description, sponsorId, price, currency = 'USD', benefits, maxExposure, durationDays = 365, isActive = true } = input;
    const query = `
      INSERT INTO sponsorship_packages (id, name, description, sponsor_id, price, currency, benefits, max_exposure, duration_days, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      name,
      description || null,
      sponsorId,
      price,
      currency,
      JSON.stringify(benefits),
      maxExposure || null,
      durationDays,
      isActive
    ]);
    return result.rows[0];
  }

  async updatePackage(id: string, input: SponsorshipPackageUpdateInput): Promise<SponsorshipPackage> {
    const { name, description, price, currency, benefits, maxExposure, durationDays, isActive } = input;
    const query = `
      UPDATE sponsorship_packages
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          currency = COALESCE($4, currency),
          benefits = COALESCE($5::text[], benefits),
          max_exposure = COALESCE($6, max_exposure),
          duration_days = COALESCE($7, duration_days),
          is_active = COALESCE($8, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    const result = await pool.query(query, [
      name || undefined,
      description || undefined,
      price || undefined,
      currency || undefined,
      benefits ? JSON.stringify(benefits) : undefined,
      maxExposure || undefined,
      durationDays || undefined,
      isActive,
      id
    ]);
    return result.rows[0];
  }

  async deletePackage(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM sponsorship_packages WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async activatePackage(id: string): Promise<SponsorshipPackage> {
    const query = `
      UPDATE sponsorship_packages
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async deactivatePackage(id: string): Promise<SponsorshipPackage> {
    const query = `
      UPDATE sponsorship_packages
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export class SponsorshipDealService {
  async getAllDeals(params?: {
    sponsorId?: string;
    status?: SponsorshipStatus;
    entityType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ deals: SponsorshipDeal[]; total: number }> {
    const { sponsorId, status, entityType, page = 1, limit = 10 } = params || {};
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM sponsorship_deals';
    const values: any[] = [];
    const conditions: string[] = [];

    if (sponsorId) {
      conditions.push('sponsor_id = $' + (values.length + 1));
      values.push(sponsorId);
    }
    if (status) {
      conditions.push('status = $' + (values.length + 1));
      values.push(status);
    }
    if (entityType) {
      conditions.push('entity_type = $' + (values.length + 1));
      values.push(entityType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY start_date DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const result = await pool.query(query, values);
    const countQuery = `
      SELECT COUNT(*) FROM sponsorship_deals
      ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);

    return {
      deals: result.rows,
      total
    };
  }

  async getDealById(id: string): Promise<SponsorshipDeal | null> {
    const result = await pool.query('SELECT * FROM sponsorship_deals WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createDeal(input: SponsorshipDealCreateInput): Promise<SponsorshipDeal> {
    const { sponsorId, packageId, entityType, entityId, startDate, endDate, totalAmount, paymentTerms, status = SponsorshipStatus.Pending, createdBy } = input;
    const query = `
      INSERT INTO sponsorship_deals (id, sponsor_id, package_id, entity_type, entity_id, start_date, end_date, total_amount, payment_terms, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      sponsorId,
      packageId || null,
      entityType,
      entityId,
      startDate,
      endDate,
      totalAmount,
      paymentTerms || null,
      status,
      createdBy
    ]);
    return result.rows[0];
  }

  async updateDeal(id: string, input: SponsorshipDealUpdateInput): Promise<SponsorshipDeal> {
    const { packageId, startDate, endDate, totalAmount, paymentTerms, status } = input;
    const query = `
      UPDATE sponsorship_deals
      SET package_id = COALESCE($1, package_id),
          start_date = COALESCE($2, start_date),
          end_date = COALESCE($3, end_date),
          total_amount = COALESCE($4, total_amount),
          payment_terms = COALESCE($5, payment_terms),
          status = COALESCE($6, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      packageId || undefined,
      startDate || undefined,
      endDate || undefined,
      totalAmount || undefined,
      paymentTerms || undefined,
      status || undefined,
      id
    ]);
    return result.rows[0];
  }

  async deleteDeal(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM sponsorship_deals WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async activateDeal(id: string): Promise<SponsorshipDeal> {
    const query = `
      UPDATE sponsorship_deals
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [SponsorshipStatus.Active, id]);
    return result.rows[0];
  }

  async expireDeal(id: string): Promise<SponsorshipDeal> {
    const query = `
      UPDATE sponsorship_deals
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [SponsorshipStatus.Expired, id]);
    return result.rows[0];
  }

  async getDealsBySponsor(sponsorId: string): Promise<SponsorshipDeal[]> {
    const result = await pool.query('SELECT * FROM sponsorship_deals WHERE sponsor_id = $1', [sponsorId]);
    return result.rows;
  }

  async getDealsByEntity(entityType: string, entityId: string): Promise<SponsorshipDeal[]> {
    const result = await pool.query(
      'SELECT * FROM sponsorship_deals WHERE entity_type = $1 AND entity_id = $2',
      [entityType, entityId]
    );
    return result.rows;
  }
}

export class DealPaymentService {
  async getAllPaymentsByDeal(dealId: string): Promise<DealPayment[]> {
    const result = await pool.query('SELECT * FROM deal_payments WHERE deal_id = $1 ORDER BY payment_date ASC', [dealId]);
    return result.rows;
  }

  async getPaymentById(id: string): Promise<DealPayment | null> {
    const result = await pool.query('SELECT * FROM deal_payments WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createPayment(input: DealPaymentCreateInput): Promise<DealPayment> {
    const { dealId, amount, currency = 'USD', paymentDate, paymentStatus = PaymentStatus.Pending, transactionReference, notes } = input;
    const query = `
      INSERT INTO deal_payments (id, deal_id, amount, currency, payment_date, payment_status, transaction_reference, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      dealId,
      amount,
      currency,
      paymentDate,
      paymentStatus,
      transactionReference || null,
      notes || null
    ]);
    return result.rows[0];
  }

  async updatePayment(id: string, input: DealPaymentUpdateInput): Promise<DealPayment> {
    const { amount, paymentStatus, transactionReference, notes } = input;
    const query = `
      UPDATE deal_payments
      SET amount = COALESCE($1, amount),
          payment_status = COALESCE($2, payment_status),
          transaction_reference = COALESCE($3, transaction_reference),
          notes = COALESCE($4, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [
      amount || undefined,
      paymentStatus || undefined,
      transactionReference || undefined,
      notes || undefined,
      id
    ]);
    return result.rows[0];
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM deal_payments WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async getDealTotalPaid(dealId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM deal_payments WHERE deal_id = $1 AND payment_status = $2',
      [dealId, PaymentStatus.Completed]
    );
    return parseFloat(result.rows[0]?.total || '0');
  }

  async getDealBalance(dealId: string): Promise<number> {
    const dealResult = await pool.query('SELECT total_amount FROM sponsorship_deals WHERE id = $1', [dealId]);
    const deal = dealResult.rows[0];
    if (!deal) return 0;

    const paidResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM deal_payments WHERE deal_id = $1 AND payment_status = $2',
      [dealId, PaymentStatus.Completed]
    );
    const totalPaid = parseFloat(paidResult.rows[0]?.total || '0');
    return parseFloat(deal.total_amount) - totalPaid;
  }
}

export class SponsorshipAssetService {
  async getAllAssetsByDeal(dealId: string): Promise<SponsorshipAsset[]> {
    const result = await pool.query('SELECT * FROM sponsorship_assets WHERE deal_id = $1', [dealId]);
    return result.rows;
  }

  async getAssetById(id: string): Promise<SponsorshipAsset | null> {
    const result = await pool.query('SELECT * FROM sponsorship_assets WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createAsset(input: SponsorshipAssetCreateInput): Promise<SponsorshipAsset> {
    const { dealId, assetType, fileUrl, fileName, fileSize, mimeType, status = 'Active' } = input;
    const query = `
      INSERT INTO sponsorship_assets (id, deal_id, asset_type, file_url, file_name, file_size, mime_type, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
      crypto.randomUUID(),
      dealId,
      assetType,
      fileUrl,
      fileName,
      fileSize || null,
      mimeType || null,
      status
    ]);
    return result.rows[0];
  }

  async updateAsset(id: string, input: SponsorshipAssetUpdateInput): Promise<SponsorshipAsset> {
    const { assetType, fileUrl, fileName, fileSize, mimeType, status } = input;
    const query = `
      UPDATE sponsorship_assets
      SET asset_type = COALESCE($1, asset_type),
          file_url = COALESCE($2, file_url),
          file_name = COALESCE($3, file_name),
          file_size = COALESCE($4, file_size),
          mime_type = COALESCE($5, mime_type),
          status = COALESCE($6, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      assetType || undefined,
      fileUrl || undefined,
      fileName || undefined,
      fileSize || undefined,
      mimeType || undefined,
      status || undefined,
      id
    ]);
    return result.rows[0];
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM sponsorship_assets WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}
