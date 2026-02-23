import { WalletRequest } from '../models/WalletRequest';

export class WalletRequestService {
  static async createWalletRequest(
    userId: string,
    walletType: 'BTC' | 'ETH' | 'USDT' | 'manual-deposit' | 'manual-withdraw',
    reference?: string,
    proofFile?: string
  ) {
    try {
      // Only check for duplicates for non-manual types
      if (walletType !== 'manual-deposit' && walletType !== 'manual-withdraw') {
        const existingRequest = await WalletRequest.findOne({
          userId,
          walletType,
          status: 'pending'
        });
        if (existingRequest) {
          return {
            success: false,
            error: `Pending ${walletType} wallet request already exists`
          };
        }
      }
      const walletRequest = new WalletRequest({
        userId,
        walletType,
        status: 'pending',
        requestedAt: new Date(),
        reference,
        proofFile
      });
      await walletRequest.save();
      return {
        success: true,
        message: 'Wallet request created',
        data: walletRequest
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async approveWalletRequest(requestId: string, walletAddress: string, approvalNotes?: string) {
    try {
      const walletRequest = await WalletRequest.findById(requestId);

      if (!walletRequest) {
        return {
          success: false,
          error: 'Wallet request not found'
        };
      }

      walletRequest.status = 'approved';
      walletRequest.walletAddress = walletAddress;
      walletRequest.approvedAt = new Date();
      walletRequest.approvalNotes = approvalNotes;

      await walletRequest.save();

      return {
        success: true,
        message: 'Wallet request approved',
        data: walletRequest
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async rejectWalletRequest(requestId: string, rejectionReason: string) {
    try {
      const walletRequest = await WalletRequest.findById(requestId);

      if (!walletRequest) {
        return {
          success: false,
          error: 'Wallet request not found'
        };
      }

      walletRequest.status = 'rejected';
      walletRequest.rejectedAt = new Date();
      walletRequest.rejectionReason = rejectionReason;

      await walletRequest.save();

      return {
        success: true,
        message: 'Wallet request rejected',
        data: walletRequest
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getUserWalletRequests(userId: string) {
    try {
      const requests = await WalletRequest.find({ userId }).sort({ createdAt: -1 });

      return {
        success: true,
        data: requests
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPendingWalletRequests() {
    try {
      const requests = await WalletRequest.find({ status: 'pending' }).sort({ createdAt: -1 });

      return {
        success: true,
        data: requests
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
