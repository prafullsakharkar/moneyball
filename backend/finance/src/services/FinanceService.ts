// Finance Service with CRUD operations and financial management

import { pool } from '../config/database';
import {
  Transaction,
  Invoice,
  Payment,
  Subscription,
  Refund,
  FinancialReport,
  TransactionCreateInput,
  InvoiceCreateInput,
  PaymentCreateInput,
  SubscriptionCreateInput,
  RefundCreateInput,
  FinancialReportCreateInput,
  FinanceEntityType,
  TransactionType,
  TransactionStatus,
  InvoiceStatus,
  PaymentStatus,
  PlanTier,
  BillingPeriod,
  SubscriptionStatus,
  RefundStatus,
  ReportType,
  ReportPeriod
} from '../models/Finance';

// Transaction Service
export class TransactionService {
  // Get transactions by entity
  async getTransactionsByEntity(
    entityType: FinanceEntityType,
    entityId: string,
    params?: { transactionType?: TransactionType; status?: TransactionStatus; limit?: number; offset?: number }
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const client = await pool.connect();
    try {
      const { transactionType, status, limit = 10, offset = 0 } = params || {};
      const values: any[] = [entityType, entityId];
      let paramIndex = 3;

      const conditions: string[] = ['entity_type = $1', 'entity_id = $2'];
      if (transactionType) {
        conditions.push(`transaction_type = $${paramIndex++}`);
        values.push(transactionType);
      }
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM transactions WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM transactions WHERE ${whereClause}`,
        values
      );

      return {
        transactions: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM transactions WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get transaction by transaction ID
  async getTransactionByTransactionId(transactionId: string): Promise<Transaction | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM transactions WHERE transaction_id = $1',
        [transactionId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create transaction
  async createTransaction(input: TransactionCreateInput): Promise<Transaction> {
    const client = await pool.connect();
    try {
      const {
        transactionId,
        entityType,
        entityId,
        transactionType,
        amount,
        currency = 'USD',
        paymentMethod,
        paymentReference,
        description,
        metadata
      } = input;

      const result = await client.query(
        `
        INSERT INTO transactions (
          id, transaction_id, entity_type, entity_id, transaction_type, amount,
          currency, status, payment_method, payment_reference, description, metadata
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'Pending', $7, $8, $9, $10
        )
        RETURNING *
        `,
        [
          transactionId, entityType, entityId, transactionType, amount,
          currency, paymentMethod, paymentReference, description,
          metadata ? JSON.stringify(metadata) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update transaction status
  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Process refund
  async processRefund(transactionId: string, amount: number, reason?: string): Promise<Refund> {
    const client = await pool.connect();
    try {
      // Create refund record
      const refundResult = await client.query(
        `
        INSERT INTO refunds (id, transaction_id, amount, currency, reason, status)
        SELECT gen_random_uuid(), t.id, $1, t.currency, $2, 'Pending'
        FROM transactions t WHERE t.id = $3
        RETURNING *
        `,
        [amount, reason, transactionId]
      );

      // Update transaction status
      await client.query(
        `UPDATE transactions SET status = 'Refunded' WHERE id = $1`,
        [transactionId]
      );

      return refundResult.rows[0];
    } finally {
      client.release();
    }
  }
}

// Invoice Service
export class InvoiceService {
  // Get invoices by entity
  async getInvoicesByEntity(
    entityType: FinanceEntityType,
    entityId: string,
    params?: { status?: InvoiceStatus; limit?: number; offset?: number }
  ): Promise<{ invoices: Invoice[]; total: number }> {
    const client = await pool.connect();
    try {
      const { status, limit = 10, offset = 0 } = params || {};
      const values: any[] = [entityType, entityId];
      let paramIndex = 3;

      const conditions: string[] = ['entity_type = $1', 'entity_id = $2'];
      if (status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM invoices WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM invoices WHERE ${whereClause}`,
        values
      );

      return {
        invoices: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get invoice by ID
  async getInvoiceById(id: string): Promise<Invoice | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM invoices WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get invoice by invoice number
  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM invoices WHERE invoice_number = $1',
        [invoiceNumber]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create invoice
  async createInvoice(input: InvoiceCreateInput): Promise<Invoice> {
    const client = await pool.connect();
    try {
      const {
        invoiceNumber,
        entityType,
        entityId,
        amount,
        taxAmount = 0,
        discountAmount = 0,
        totalAmount,
        currency = 'USD',
        status = 'Draft',
        dueDate,
        items
      } = input;

      const result = await client.query(
        `
        INSERT INTO invoices (
          id, invoice_number, entity_type, entity_id, amount, tax_amount,
          discount_amount, total_amount, currency, status, due_date, items
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
        RETURNING *
        `,
        [
          invoiceNumber, entityType, entityId, amount, taxAmount, discountAmount,
          totalAmount, currency, status, dueDate,
          items ? JSON.stringify(items) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update invoice status
  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const client = await pool.connect();
    try {
      const updates: string[] = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
      const values: any[] = [status, id];

      if (status === 'Paid') {
        updates.push('paid_at = CURRENT_TIMESTAMP');
      }

      const query = `UPDATE invoices SET ${updates.join(', ')} WHERE id = $2 RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Mark invoice as paid
  async markInvoiceAsPaid(invoiceId: string, paymentId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE invoices SET status = 'Paid', paid_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [invoiceId]
      );
      await client.query(
        `UPDATE payments SET payment_status = 'Completed' WHERE id = $1`,
        [paymentId]
      );
    } finally {
      client.release();
    }
  }
}

// Payment Service
export class PaymentService {
  // Get payments by invoice
  async getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM payments WHERE invoice_id = $1 ORDER BY created_at DESC',
        [invoiceId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get payment by ID
  async getPaymentById(id: string): Promise<Payment | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM payments WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get payment by payment ID
  async getPaymentByPaymentId(paymentId: string): Promise<Payment | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM payments WHERE payment_id = $1',
        [paymentId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create payment
  async createPayment(input: PaymentCreateInput): Promise<Payment> {
    const client = await pool.connect();
    try {
      const {
        paymentId,
        invoiceId,
        amount,
        currency = 'USD',
        paymentMethod,
        paymentStatus = 'Pending',
        transactionReference,
        gatewayResponse
      } = input;

      const result = await client.query(
        `
        INSERT INTO payments (
          id, payment_id, invoice_id, amount, currency, payment_method,
          payment_status, transaction_reference, gateway_response
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING *
        `,
        [
          paymentId, invoiceId, amount, currency, paymentMethod,
          paymentStatus, transactionReference,
          gatewayResponse ? JSON.stringify(gatewayResponse) : null
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update payment status
  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE payments SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Subscription Service
export class SubscriptionService {
  // Get subscriptions by organization
  async getSubscriptionsByOrganization(organizationId: string): Promise<Subscription[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM subscriptions WHERE organization_id = $1 ORDER BY start_date DESC',
        [organizationId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get subscription by ID
  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM subscriptions WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create subscription
  async createSubscription(input: SubscriptionCreateInput): Promise<Subscription> {
    const client = await pool.connect();
    try {
      const {
        organizationId,
        planName,
        planTier,
        amount,
        currency = 'USD',
        billingPeriod,
        status = 'Active',
        startDate,
        endDate,
        autoRenew = true
      } = input;

      const result = await client.query(
        `
        INSERT INTO subscriptions (
          id, organization_id, plan_name, plan_tier, amount, currency,
          billing_period, status, start_date, end_date, auto_renew
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        RETURNING *
        `,
        [
          organizationId, planName, planTier, amount, currency,
          billingPeriod, status, startDate, endDate, autoRenew
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Update subscription status
  async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Cancel subscription
  async cancelSubscription(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE subscriptions SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
    } finally {
      client.release();
    }
  }

  // Renew subscription
  async renewSubscription(id: string): Promise<Subscription> {
    const client = await pool.connect();
    try {
      // Get current subscription
      const currentResult = await client.query(
        'SELECT * FROM subscriptions WHERE id = $1',
        [id]
      );
      const current = currentResult.rows[0];

      if (!current) {
        throw new Error('Subscription not found');
      }

      // Calculate new dates
      const startDate = new Date(current.end_date);
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(startDate);
      if (current.billing_period === 'Monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (current.billing_period === 'Quarterly') {
        endDate.setMonth(endDate.getMonth() + 3);
      } else if (current.billing_period === 'Annually') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Create new subscription
      const result = await client.query(
        `
        INSERT INTO subscriptions (
          id, organization_id, plan_name, plan_tier, amount, currency,
          billing_period, status, start_date, end_date, auto_renew
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'Active', $7, $8, $9
        )
        RETURNING *
        `,
        [
          current.organization_id, current.plan_name, current.plan_tier,
          current.amount, current.currency, current.billing_period,
          startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0],
          current.auto_renew
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Refund Service
export class RefundService {
  // Get refunds by transaction
  async getRefundsByTransaction(transactionId: string): Promise<Refund[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM refunds WHERE transaction_id = $1 ORDER BY created_at DESC',
        [transactionId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get refunds by invoice
  async getRefundsByInvoice(invoiceId: string): Promise<Refund[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM refunds WHERE invoice_id = $1 ORDER BY created_at DESC',
        [invoiceId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get refund by ID
  async getRefundById(id: string): Promise<Refund | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM refunds WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create refund
  async createRefund(input: RefundCreateInput): Promise<Refund> {
    const client = await pool.connect();
    try {
      const {
        transactionId,
        invoiceId,
        amount,
        currency = 'USD',
        reason,
        status = 'Pending'
      } = input;

      const result = await client.query(
        `
        INSERT INTO refunds (
          id, transaction_id, invoice_id, amount, currency, reason, status
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6
        )
        RETURNING *
        `,
        [transactionId, invoiceId, amount, currency, reason, status]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Process refund
  async processRefund(id: string): Promise<Refund> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE refunds SET status = 'Completed', processed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Financial Report Service
export class FinancialReportService {
  // Get financial reports
  async getFinancialReports(
    params?: { reportType?: ReportType; reportPeriod?: ReportPeriod; limit?: number; offset?: number }
  ): Promise<{ reports: FinancialReport[]; total: number }> {
    const client = await pool.connect();
    try {
      const { reportType, reportPeriod, limit = 10, offset = 0 } = params || {};
      const values: any[] = [];
      let paramIndex = 1;

      const conditions: string[] = [];
      if (reportType) {
        conditions.push(`report_type = $${paramIndex++}`);
        values.push(reportType);
      }
      if (reportPeriod) {
        conditions.push(`report_period = $${paramIndex++}`);
        values.push(reportPeriod);
      }

      const whereClause = conditions.join(' AND ');

      const result = await client.query(
        `
        SELECT * FROM financial_reports ${whereClause ? 'WHERE ' + whereClause : ''}
        ORDER BY report_date DESC, created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
        `,
        [...values, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) FROM financial_reports ${whereClause ? 'WHERE ' + whereClause : ''}`,
        values
      );

      return {
        reports: result.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  // Get report by ID
  async getReportById(id: string): Promise<FinancialReport | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM financial_reports WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create financial report
  async createFinancialReport(input: FinancialReportCreateInput): Promise<FinancialReport> {
    const client = await pool.connect();
    try {
      const { reportType, reportPeriod, reportDate, data } = input;

      const result = await client.query(
        `
        INSERT INTO financial_reports (
          id, report_type, report_period, report_date, data
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4
        )
        RETURNING *
        `,
        [reportType, reportPeriod, reportDate, JSON.stringify(data)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Generate daily sales report
  async generateDailySalesReport(reportDate: string): Promise<FinancialReport> {
    const client = await pool.connect();
    try {
      // Get daily transaction summary
      const transactionsResult = await client.query(
        `
        SELECT 
          transaction_type,
          COUNT(*) as count,
          SUM(amount) as total_amount,
          COUNT(DISTINCT entity_id) as unique_entities
        FROM transactions
        WHERE DATE(created_at) = $1
        GROUP BY transaction_type
        ORDER BY total_amount DESC
        `,
        [reportDate]
      );

      // Get daily payment summary
      const paymentsResult = await client.query(
        `
        SELECT 
          payment_method,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM payments
        WHERE DATE(created_at) = $1
        GROUP BY payment_method
        ORDER BY total_amount DESC
        `,
        [reportDate]
      );

      // Get daily invoice summary
      const invoicesResult = await client.query(
        `
        SELECT 
          status,
          COUNT(*) as count,
          SUM(total_amount) as total_amount
        FROM invoices
        WHERE DATE(created_at) = $1
        GROUP BY status
        ORDER BY total_amount DESC
        `,
        [reportDate]
      );

      const reportData = {
        date: reportDate,
        transactions: transactionsResult.rows,
        payments: paymentsResult.rows,
        invoices: invoicesResult.rows,
        generated_at: new Date().toISOString()
      };

      const result = await client.query(
        `
        INSERT INTO financial_reports (
          id, report_type, report_period, report_date, data
        ) VALUES (
          gen_random_uuid(), 'DailySales', 'Daily', $1, $2
        )
        RETURNING *
        `,
        [reportDate, JSON.stringify(reportData)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Generate monthly revenue report
  async generateMonthlyRevenueReport(year: number, month: number): Promise<FinancialReport> {
    const client = await pool.connect();
    try {
      const reportDate = `${year}-${String(month).padStart(2, '0')}`;

      // Get monthly transaction summary
      const transactionsResult = await client.query(
        `
        SELECT 
          transaction_type,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM transactions
        WHERE EXTRACT(YEAR FROM created_at) = $1
          AND EXTRACT(MONTH FROM created_at) = $2
        GROUP BY transaction_type
        ORDER BY total_amount DESC
        `,
        [year, month]
      );

      // Get monthly subscription summary
      const subscriptionsResult = await client.query(
        `
        SELECT 
          plan_tier,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM subscriptions
        WHERE EXTRACT(YEAR FROM start_date) = $1
          AND EXTRACT(MONTH FROM start_date) = $2
        GROUP BY plan_tier
        ORDER BY total_amount DESC
        `,
        [year, month]
      );

      const reportData = {
        year,
        month,
        transactions: transactionsResult.rows,
        subscriptions: subscriptionsResult.rows,
        total_revenue: transactionsResult.rows.reduce((sum: number, row: any) => sum + parseFloat(row.total_amount), 0),
        generated_at: new Date().toISOString()
      };

      const result = await client.query(
        `
        INSERT INTO financial_reports (
          id, report_type, report_period, report_date, data
        ) VALUES (
          gen_random_uuid(), 'MonthlyRevenue', 'Monthly', $1, $2
        )
        RETURNING *
        `,
        [reportDate, JSON.stringify(reportData)]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

// Export all services
export const transactionService = new TransactionService();
export const invoiceService = new InvoiceService();
export const paymentService = new PaymentService();
export const subscriptionService = new SubscriptionService();
export const refundService = new RefundService();
export const financialReportService = new FinancialReportService();
