// Routes for Sponsorship Service

import { Router } from 'express';
import {
  SponsorService,
  SponsorshipPackageService,
  SponsorshipDealService,
  DealPaymentService,
  SponsorshipAssetService
} from '../services/SponsorshipService';
import { Request, Response } from 'express';

const router = Router();
const sponsorService = new SponsorService();
const packageService = new SponsorshipPackageService();
const dealService = new SponsorshipDealService();
const paymentService = new DealPaymentService();
const assetService = new SponsorshipAssetService();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'sponsorship' });
});

// Sponsors endpoints
router.get('/sponsors', async (req: Request, res: Response) => {
  try {
    const { sponsorType, status, page, limit } = req.query;
    const result = await sponsorService.getAllSponsors({
      sponsorType: sponsorType as any,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.sponsors, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

router.get('/sponsors/:id', async (req: Request, res: Response) => {
  try {
    const sponsor = await sponsorService.getSponsorById(req.params.id);
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    res.json({ data: sponsor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sponsor' });
  }
});

router.post('/sponsors', async (req: Request, res: Response) => {
  try {
    const sponsor = await sponsorService.createSponsor(req.body);
    res.status(201).json({ data: sponsor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

router.put('/sponsors/:id', async (req: Request, res: Response) => {
  try {
    const sponsor = await sponsorService.updateSponsor(req.params.id, req.body);
    res.json({ data: sponsor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

router.delete('/sponsors/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await sponsorService.deleteSponsor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
});

router.post('/sponsors/:id/activate', async (req: Request, res: Response) => {
  try {
    const sponsor = await sponsorService.activateSponsor(req.params.id);
    res.json({ data: sponsor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate sponsor' });
  }
});

router.post('/sponsors/:id/deactivate', async (req: Request, res: Response) => {
  try {
    const sponsor = await sponsorService.deactivateSponsor(req.params.id);
    res.json({ data: sponsor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate sponsor' });
  }
});

// Sponsorship packages endpoints
router.get('/packages', async (req: Request, res: Response) => {
  try {
    const { sponsorId, isActive } = req.query;
    const packages = await packageService.getAllPackages({
      sponsorId: sponsorId as string,
      isActive: isActive === 'true'
    });
    res.json({ data: packages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

router.get('/packages/:id', async (req: Request, res: Response) => {
  try {
    const packageItem = await packageService.getPackageById(req.params.id);
    if (!packageItem) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ data: packageItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

router.post('/packages', async (req: Request, res: Response) => {
  try {
    const packageItem = await packageService.createPackage(req.body);
    res.status(201).json({ data: packageItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create package' });
  }
});

router.put('/packages/:id', async (req: Request, res: Response) => {
  try {
    const packageItem = await packageService.updatePackage(req.params.id, req.body);
    res.json({ data: packageItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update package' });
  }
});

router.delete('/packages/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await packageService.deletePackage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// Sponsorship deals endpoints
router.get('/deals', async (req: Request, res: Response) => {
  try {
    const { sponsorId, status, entityType, page, limit } = req.query;
    const result = await dealService.getAllDeals({
      sponsorId: sponsorId as string,
      status: status as any,
      entityType: entityType as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    res.json({ data: result.deals, meta: { total: result.total } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

router.get('/deals/:id', async (req: Request, res: Response) => {
  try {
    const deal = await dealService.getDealById(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.json({ data: deal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

router.post('/deals', async (req: Request, res: Response) => {
  try {
    const deal = await dealService.createDeal(req.body);
    res.status(201).json({ data: deal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

router.put('/deals/:id', async (req: Request, res: Response) => {
  try {
    const deal = await dealService.updateDeal(req.params.id, req.body);
    res.json({ data: deal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

router.delete('/deals/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await dealService.deleteDeal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

router.post('/deals/:id/activate', async (req: Request, res: Response) => {
  try {
    const deal = await dealService.activateDeal(req.params.id);
    res.json({ data: deal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate deal' });
  }
});

router.post('/deals/:id/expire', async (req: Request, res: Response) => {
  try {
    const deal = await dealService.expireDeal(req.params.id);
    res.json({ data: deal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to expire deal' });
  }
});

// Deal payments endpoints
router.get('/deals/:dealId/payments', async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAllPaymentsByDeal(req.params.dealId);
    res.json({ data: payments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/deals/:dealId/payments/:id', async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ data: payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

router.post('/deals/:dealId/payments', async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({ data: payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

router.put('/deals/:dealId/payments/:id', async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body);
    res.json({ data: payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

router.delete('/deals/:dealId/payments/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await paymentService.deletePayment(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

router.get('/deals/:dealId/total-paid', async (req: Request, res: Response) => {
  try {
    const totalPaid = await paymentService.getDealTotalPaid(req.params.dealId);
    res.json({ data: { totalPaid } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate total paid' });
  }
});

router.get('/deals/:dealId/balance', async (req: Request, res: Response) => {
  try {
    const balance = await paymentService.getDealBalance(req.params.dealId);
    res.json({ data: { balance } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate balance' });
  }
});

// Sponsorship assets endpoints
router.get('/deals/:dealId/assets', async (req: Request, res: Response) => {
  try {
    const assets = await assetService.getAllAssetsByDeal(req.params.dealId);
    res.json({ data: assets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

router.get('/assets/:id', async (req: Request, res: Response) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ data: asset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

router.post('/deals/:dealId/assets', async (req: Request, res: Response) => {
  try {
    const asset = await assetService.createAsset(req.body);
    res.status(201).json({ data: asset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

router.put('/assets/:id', async (req: Request, res: Response) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.body);
    res.json({ data: asset });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

router.delete('/assets/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await assetService.deleteAsset(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
