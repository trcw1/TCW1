import { Order } from '../models/Order';

export class OrderService {
  static generateOrderNumber(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static async createOrder(userId: string, items: any[], totalAmount: number, paymentMethod: string) {
    try {
      const order = new Order({
        orderNumber: this.generateOrderNumber(),
        userId,
        items,
        totalAmount,
        currency: 'USD',
        paymentMethod,
        status: 'pending',
        paymentStatus: 'pending'
      });

      await order.save();

      return {
        success: true,
        message: 'Order created',
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getOrder(orderId: string) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      return {
        success: true,
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getUserOrders(userId: string, skip: number = 0, limit: number = 20) {
    try {
      const orders = await Order.find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({ userId });

      return {
        success: true,
        data: {
          orders,
          total,
          skip,
          limit
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      return {
        success: true,
        message: 'Order status updated',
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
      );

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      return {
        success: true,
        message: 'Payment status updated',
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async addShippingInfo(orderId: string, shippingAddress: any, trackingNumber?: string) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          shippingAddress,
          trackingNumber,
          status: 'shipped'
        },
        { new: true }
      );

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      return {
        success: true,
        message: 'Shipping info added',
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async cancelOrder(orderId: string) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'cancelled' },
        { new: true }
      );

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      return {
        success: true,
        message: 'Order cancelled',
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
