import { MarketplaceListing } from '../models/MarketplaceListing';

export class MarketplaceService {
  static async createListing(listingData: any) {
    try {
      // Set expiration date to 60 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 60);

      const listing = new MarketplaceListing({
        ...listingData,
        expiresAt,
        status: 'active'
      });

      await listing.save();

      return {
        success: true,
        message: 'Listing created',
        data: listing
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getListing(listingId: string) {
    try {
      const listing = await MarketplaceListing.findById(listingId);

      if (!listing) {
        return {
          success: false,
          error: 'Listing not found'
        };
      }

      return {
        success: true,
        data: listing
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async searchListings(searchQuery: string, category?: string, skip: number = 0, limit: number = 20) {
    try {
      const query: any = { status: 'active' };

      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ];
      }

      if (category) {
        query.category = category;
      }

      const listings = await MarketplaceListing.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await MarketplaceListing.countDocuments(query);

      return {
        success: true,
        data: {
          listings,
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

  static async getSellerListings(sellerId: string, skip: number = 0, limit: number = 20) {
    try {
      const listings = await MarketplaceListing.find({ sellerId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await MarketplaceListing.countDocuments({ sellerId });

      return {
        success: true,
        data: {
          listings,
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

  static async updateListing(listingId: string, updateData: any) {
    try {
      const listing = await MarketplaceListing.findByIdAndUpdate(listingId, updateData, { new: true });

      if (!listing) {
        return {
          success: false,
          error: 'Listing not found'
        };
      }

      return {
        success: true,
        message: 'Listing updated',
        data: listing
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteListing(listingId: string) {
    try {
      const result = await MarketplaceListing.findByIdAndDelete(listingId);

      if (!result) {
        return {
          success: false,
          error: 'Listing not found'
        };
      }

      return {
        success: true,
        message: 'Listing deleted'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async markAsSold(listingId: string) {
    try {
      const listing = await MarketplaceListing.findByIdAndUpdate(
        listingId,
        { status: 'sold' },
        { new: true }
      );

      if (!listing) {
        return {
          success: false,
          error: 'Listing not found'
        };
      }

      return {
        success: true,
        message: 'Listing marked as sold',
        data: listing
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async incrementSales(listingId: string) {
    try {
      const listing = await MarketplaceListing.findByIdAndUpdate(
        listingId,
        { $inc: { sales: 1 } },
        { new: true }
      );

      if (!listing) {
        return {
          success: false,
          error: 'Listing not found'
        };
      }

      return {
        success: true,
        data: listing
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async expireOldListings() {
    try {
      const result = await MarketplaceListing.updateMany(
        { status: 'active', expiresAt: { $lte: new Date() } },
        { status: 'expired' }
      );

      return {
        success: true,
        message: `${result.modifiedCount} listings expired`,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
