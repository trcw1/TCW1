import { Membership } from '../models/Membership';

export class MembershipService {
  static async createMembership(userId: string, tier: string, paymentMethod: string, monthlyFee: number = 0) {
    try {
      // Check if user already has membership
      const existingMembership = await Membership.findOne({ userId });

      if (existingMembership) {
        return {
          success: false,
          error: 'User already has an active membership'
        };
      }

      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      const benefits = this.getBenefitsByTier(tier);

      const membership = new Membership({
        userId,
        membershipTier: tier,
        status: 'active',
        startDate: new Date(),
        monthlyFee,
        currency: 'USD',
        benefits,
        paymentMethod,
        nextPaymentDate,
        autoRenew: true
      });

      await membership.save();

      return {
        success: true,
        message: 'Membership created',
        data: membership
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static getBenefitsByTier(tier: string): string[] {
    const benefits: Record<string, string[]> = {
      basic: ['Access to platform', 'Standard support'],
      premium: ['Access to platform', 'Priority support', 'Advanced features', 'Monthly webinars'],
      gold: ['Access to platform', 'Priority 24/7 support', 'All advanced features', 'Weekly webinars', 'Personal account manager'],
      platinum: ['Everything in Gold', 'Dedicated account manager', 'Custom integrations', 'Priority API access', 'VIP events']
    };

    return benefits[tier] || benefits['basic'];
  }

  static async getUserMembership(userId: string) {
    try {
      const membership = await Membership.findOne({ userId });

      if (!membership) {
        return {
          success: false,
          error: 'User membership not found'
        };
      }

      return {
        success: true,
        data: membership
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async upgradeMembership(userId: string, newTier: string) {
    try {
      const membership = await Membership.findOne({ userId });

      if (!membership) {
        return {
          success: false,
          error: 'User membership not found'
        };
      }

      const newFees: Record<string, number> = {
        basic: 0,
        premium: 9.99,
        gold: 29.99,
        platinum: 99.99
      };

      membership.membershipTier = newTier;
      membership.monthlyFee = newFees[newTier] || 0;
      membership.benefits = this.getBenefitsByTier(newTier);
      membership.updatedAt = new Date();

      await membership.save();

      return {
        success: true,
        message: 'Membership upgraded',
        data: membership
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async cancelMembership(userId: string) {
    try {
      const membership = await Membership.findOne({ userId });

      if (!membership) {
        return {
          success: false,
          error: 'User membership not found'
        };
      }

      membership.status = 'cancelled';
      membership.endDate = new Date();
      membership.autoRenew = false;

      await membership.save();

      return {
        success: true,
        message: 'Membership cancelled',
        data: membership
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async processAutoRenewal() {
    try {
      const memberships = await Membership.find({
        autoRenew: true,
        status: 'active',
        nextPaymentDate: { $lte: new Date() }
      });

      const updated = [];
      for (const membership of memberships) {
        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        membership.lastPaymentDate = new Date();
        membership.nextPaymentDate = nextPaymentDate;

        await membership.save();
        updated.push(membership);
      }

      return {
        success: true,
        message: `${updated.length} memberships renewed`,
        data: updated
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
