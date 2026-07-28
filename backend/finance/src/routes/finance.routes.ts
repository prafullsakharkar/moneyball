// Routes for Finance Service

import { Router } from 'express';
import {
  transactionService,
  invoiceService,
  paymentService,
  subscriptionService,
  refundService,
  financialReportService
} from '../services/FinanceService';
import {
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

const router = Router();

// Transaction routes
router.get('/transactions', async (req, res) => {
  try {
    const { entityType, entityId, transactionType, status, limit, offset } = req.query;
    const params: any = {};
    if (entityType) params.entityType = entityType as FinanceEntityType;
    if (entityId) params.entityId = entityId;
    if (transactionType) params.transactionType = transactionType as TransactionType;
    if (status) params.status = status as TransactionStatus;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await transactionService.getTransactionsByEntity(
      params.entityType,
      params.entityId,
      params
    );
    res.json({ success: true, data: result.transactions, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch transaction' });
  }
});

router.get('/transactions/transaction-id/:transactionId', async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionByTransactionId(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch transaction' });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const input: TransactionCreateInput = req.body;
    const transaction = await transactionService.createTransaction(input);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create transaction' });
  }
});

router.patch('/transactions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await transactionService.updateTransactionStatus(req.params.id, status);
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update transaction status' });
  }
});

router.post('/transactions/:transactionId/refunds', async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const refund = await transactionService.processRefund(req.params.transactionId, amount, reason);
    res.status(201).json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process refund' });
  }
});

// Invoice routes
router.get('/invoices', async (req, res) => {
  try {
    const { entityType, entityId, status, limit, offset } = req.query;
    const params: any = {};
    if (entityType) params.entityType = entityType as FinanceEntityType;
    if (entityId) params.entityId = entityId;
    if (status) params.status = status as InvoiceStatus;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await invoiceService.getInvoicesByEntity(
      params.entityType,
      params.entityId,
      params
    );
    res.json({ success: true, data: result.invoices, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch invoices' });
  }
});

router.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch invoice' });
  }
});

router.get('/invoices/invoice-number/:invoiceNumber', async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceByNumber(req.params.invoiceNumber);
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch invoice' });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const input: InvoiceCreateInput = req.body;
    const invoice = await invoiceService.createInvoice(input);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create invoice' });
  }
});

router.patch('/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await invoiceService.updateInvoiceStatus(req.params.id, status);
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update invoice status' });
  }
});

router.post('/invoices/:invoiceId/pay', async (req, res) => {
  try {
    const { paymentId } = req.body;
    await invoiceService.markInvoiceAsPaid(req.params.invoiceId, paymentId);
    res.json({ success: true, message: 'Invoice marked as paid' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark invoice as paid' });
  }
});

// Payment routes
router.get('/payments', async (req, res) => {
  try {
    const { invoiceId, paymentStatus, limit, offset } = req.query;
    const payments = await paymentService.getPaymentsByInvoice(invoiceId as string);
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
});

router.get('/payments/:id', async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch payment' });
  }
});

router.get('/payments/payment-id/:paymentId', async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByPaymentId(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch payment' });
  }
});

router.post('/payments', async (req, res) => {
  try {
    const input: PaymentCreateInput = req.body;
    const payment = await paymentService.createPayment(input);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create payment' });
  }
});

router.patch('/payments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await paymentService.updatePaymentStatus(req.params.id, status);
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update payment status' });
  }
});

// Subscription routes
router.get('/subscriptions', async (req, res) => {
  try {
    const { organizationId } = req.query;
    const subscriptions = await subscriptionService.getSubscriptionsByOrganization(organizationId as string);
    res.json({ success: true, data: subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch subscriptions' });
  }
});

router.get('/subscriptions/:id', async (req, res) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }
    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch subscription' });
  }
});

router.post('/subscriptions', async (req, res) => {
  try {
    const input: SubscriptionCreateInput = req.body;
    const subscription = await subscriptionService.createSubscription(input);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create subscription' });
  }
});

router.patch('/subscriptions/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const subscription = await subscriptionService.updateSubscriptionStatus(req.params.id, status);
    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update subscription status' });
  }
});

router.post('/subscriptions/:id/cancel', async (req, res) => {
  try {
    await subscriptionService.cancelSubscription(req.params.id);
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
  }
});

router.post('/subscriptions/:id/renew', async (req, res) => {
  try {
    const subscription = await subscriptionService.renewSubscription(req.params.id);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to renew subscription' });
  }
});

// Refund routes
router.get('/refunds', async (req, res) => {
  try {
    const { transactionId, invoiceId } = req.query;
    let refunds;
    if (transactionId) {
      refunds = await refundService.getRefundsByTransaction(transactionId as string);
    } else if (invoiceId) {
      refunds = await refundService.getRefundsByInvoice(invoiceId as string);
    } else {
      refunds = [];
    }
    res.json({ success: true, data: refunds });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch refunds' });
  }
});

router.get('/refunds/:id', async (req, res) => {
  try {
    const refund = await refundService.getRefundById(req.params.id);
    if (!refund) {
      return res.status(404).json({ success: false, error: 'Refund not found' });
    }
    res.json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch refund' });
  }
});

router.post('/refunds', async (req, res) => {
  try {
    const input: RefundCreateInput = req.body;
    const refund = await refundService.createRefund(input);
    res.status(201).json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create refund' });
  }
});

router.post('/refunds/:id/process', async (req, res) => {
  try {
    const refund = await refundService.processRefund(req.params.id);
    res.json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process refund' });
  }
});

// Financial Report routes
router.get('/financial-reports', async (req, res) => {
  try {
    const { reportType, reportPeriod, limit, offset } = req.query;
    const params: any = {};
    if (reportType) params.reportType = reportType as ReportType;
    if (reportPeriod) params.reportPeriod = reportPeriod as ReportPeriod;
    if (limit) params.limit = parseInt(limit as string);
    if (offset) params.offset = parseInt(offset as string);

    const result = await financialReportService.getFinancialReports(params);
    res.json({ success: true, data: result.reports, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch financial reports' });
  }
});

router.get('/financial-reports/:id', async (req, res) => {
  try {
    const report = await financialReportService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch report' });
  }
});

router.post('/financial-reports/daily-sales', async (req, res) => {
  try {
    const { reportDate } = req.body;
    const report = await financialReportService.generateDailySalesReport(reportDate);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate daily sales report' });
  }
});

router.post('/financial-reports/monthly-revenue', async (req, res) => {
  try {
    const { year, month } = req.body;
    const report = await financialReportService.generateMonthlyRevenueReport(year, month);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate monthly revenue report' });
  }
});

export default router;
