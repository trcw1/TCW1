import express, { Router, Request, Response } from 'express';
import { OrderService } from '../services/order.service';

const router: Router = express.Router();

// Create order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, items, totalAmount, paymentMethod } = req.body;

    if (!userId || !items || !totalAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await OrderService.createOrder(userId, items, totalAmount, paymentMethod);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get order
router.get('/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getOrder(orderId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's orders
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { skip = 0, limit = 20 } = req.query;
    const result = await OrderService.getUserOrders(userId, parseInt(skip as string), parseInt(limit as string));
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update order status
router.put('/:orderId/status', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const result = await OrderService.updateOrderStatus(orderId, status);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update payment status
router.put('/:orderId/payment-status', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        error: 'Payment status is required'
      });
    }

    const result = await OrderService.updatePaymentStatus(orderId, paymentStatus);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add shipping info
router.put('/:orderId/shipping', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { shippingAddress, trackingNumber } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required'
      });
    }

    const result = await OrderService.addShippingInfo(orderId, shippingAddress, trackingNumber);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel order
router.delete('/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.cancelOrder(orderId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
