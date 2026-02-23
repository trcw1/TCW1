import express, { Router, Request, Response } from 'express';
import { MarketplaceService } from '../services/marketplace.service';

const router: Router = express.Router();

// Create listing
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await MarketplaceService.createListing(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get listing
router.get('/:listingId', async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const result = await MarketplaceService.getListing(listingId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search listings
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, skip = 0, limit = 20 } = req.query;
    const result = await MarketplaceService.searchListings(
      search as string,
      category as string,
      parseInt(skip as string),
      parseInt(limit as string)
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get seller's listings
router.get('/seller/:sellerId', async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const { skip = 0, limit = 20 } = req.query;
    const result = await MarketplaceService.getSellerListings(
      sellerId,
      parseInt(skip as string),
      parseInt(limit as string)
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update listing
router.put('/:listingId', async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const result = await MarketplaceService.updateListing(listingId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete listing
router.delete('/:listingId', async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const result = await MarketplaceService.deleteListing(listingId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark listing as sold
router.put('/:listingId/sold', async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const result = await MarketplaceService.markAsSold(listingId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Increment sales
router.put('/:listingId/increment-sales', async (req: Request, res: Response) => {
  try {
    const { listingId } = req.params;
    const result = await MarketplaceService.incrementSales(listingId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Expire old listings (admin)
router.post('/expire-old', async (req: Request, res: Response) => {
  try {
    const result = await MarketplaceService.expireOldListings();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
