import express, { Router, Request, Response } from 'express';
import { ProductCatalogService } from '../services/product-catalog.service';

const router: Router = express.Router();

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await ProductCatalogService.createProduct(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductCatalogService.getProduct(productId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, skip = 0, limit = 20 } = req.query;
    const result = await ProductCatalogService.searchProducts(
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

// Get products by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { skip = 0, limit = 20 } = req.query;
    const result = await ProductCatalogService.getProductsByCategory(
      category,
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

// Update product
router.put('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductCatalogService.updateProduct(productId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete product
router.delete('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ProductCatalogService.deleteProduct(productId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update stock
router.put('/:productId/stock', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Quantity is required'
      });
    }

    const result = await ProductCatalogService.updateStock(productId, quantity);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
