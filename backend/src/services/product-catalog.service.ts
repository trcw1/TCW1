import { Product } from '../models/Product';

export class ProductCatalogService {
  static async createProduct(productData: any) {
    try {
      const product = new Product(productData);
      await product.save();

      return {
        success: true,
        message: 'Product created',
        data: product
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getProduct(productId: string) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        data: product
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async searchProducts(searchQuery: string, category?: string, skip: number = 0, limit: number = 20) {
    try {
      const query: any = { isActive: true };

      if (searchQuery) {
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ];
      }

      if (category) {
        query.category = category;
      }

      const products = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);

      return {
        success: true,
        data: {
          products,
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

  static async getProductsByCategory(category: string, skip: number = 0, limit: number = 20) {
    try {
      const products = await Product.find({ category, isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({ category, isActive: true });

      return {
        success: true,
        data: {
          products,
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

  static async updateProduct(productId: string, updateData: any) {
    try {
      const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        message: 'Product updated',
        data: product
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteProduct(productId: string) {
    try {
      const result = await Product.findByIdAndDelete(productId);

      if (!result) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        message: 'Product deleted'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updateStock(productId: string, quantity: number) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        { stock: quantity },
        { new: true }
      );

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        data: product
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
