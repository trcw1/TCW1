import { UserWallet } from '../models/UserWallet';

export class UserWalletService {
  static async assignWallet(userId: string, walletAddress: string, walletType: 'BTC' | 'ETH' | 'USDT' | 'PAYPAL', publicKey?: string) {
    try {
      // Check if wallet already exists for this user and type
      const existingWallet = await UserWallet.findOne({
        userId,
        walletType,
        isActive: true
      });

      if (existingWallet) {
        return {
          success: false,
          error: `User already has an active ${walletType} wallet`
        };
      }

      const wallet = new UserWallet({
        userId,
        walletAddress,
        walletType,
        publicKey,
        isActive: true,
        assignedAt: new Date()
      });

      await wallet.save();

      return {
        success: true,
        message: 'Wallet assigned successfully',
        data: wallet
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getUserWallets(userId: string) {
    try {
      const wallets = await UserWallet.find({ userId, isActive: true });

      return {
        success: true,
        data: wallets
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getWallet(userId: string, walletType: 'BTC' | 'ETH' | 'USDT' | 'PAYPAL') {
    try {
      const wallet = await UserWallet.findOne({
        userId,
        walletType,
        isActive: true
      });

      if (!wallet) {
        return {
          success: false,
          error: `${walletType} wallet not found`
        };
      }

      return {
        success: true,
        data: wallet
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updateBalance(userId: string, walletType: string, amount: number) {
    try {
      const wallet = await UserWallet.findOne({
        userId,
        walletType,
        isActive: true
      });

      if (!wallet) {
        return {
          success: false,
          error: 'Wallet not found'
        };
      }

      wallet.balance = amount;
      wallet.lastSyncedAt = new Date();
      await wallet.save();

      return {
        success: true,
        data: wallet
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deactivateWallet(userId: string, walletType: string) {
    try {
      const wallet = await UserWallet.findOne({
        userId,
        walletType
      });

      if (!wallet) {
        return {
          success: false,
          error: 'Wallet not found'
        };
      }

      wallet.isActive = false;
      await wallet.save();

      return {
        success: true,
        message: 'Wallet deactivated'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
