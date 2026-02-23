import { DepositConfirmation } from '../models/DepositConfirmation';

export class DepositConfirmationService {
  static async createDepositConfirmation(
    userId: string,
    depositAmount: number,
    currency: string,
    toAddress: string,
    transactionHash?: string,
    fromAddress?: string
  ) {
    try {
      const confirmation = new DepositConfirmation({
        userId,
        depositAmount,
        currency,
        toAddress,
        transactionHash,
        fromAddress,
        status: 'pending',
        confirmations: 0,
        requiredConfirmations: 3,
        depositDate: new Date()
      });

      await confirmation.save();

      return {
        success: true,
        message: 'Deposit confirmation initiated',
        data: confirmation
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updateConfirmationCount(depositId: string, confirmationCount: number) {
    try {
      const confirmation = await DepositConfirmation.findById(depositId);

      if (!confirmation) {
        return {
          success: false,
          error: 'Deposit confirmation not found'
        };
      }

      confirmation.confirmations = confirmationCount;

      if (confirmationCount >= confirmation.requiredConfirmations && confirmation.status === 'pending') {
        confirmation.status = 'confirmed';
        confirmation.confirmedAt = new Date();
      }

      await confirmation.save();

      return {
        success: true,
        data: confirmation
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async markDepositFailed(depositId: string, failureReason: string) {
    try {
      const confirmation = await DepositConfirmation.findById(depositId);

      if (!confirmation) {
        return {
          success: false,
          error: 'Deposit confirmation not found'
        };
      }

      confirmation.status = 'failed';
      confirmation.failureReason = failureReason;

      await confirmation.save();

      return {
        success: true,
        message: 'Deposit marked as failed',
        data: confirmation
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getUserDepositStatus(userId: string, status?: string) {
    try {
      const query: any = { userId };
      if (status) {
        query.status = status;
      }

      const confirmations = await DepositConfirmation.find(query).sort({ depositDate: -1 });

      return {
        success: true,
        data: confirmations
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPendingDeposits() {
    try {
      const confirmations = await DepositConfirmation.find({ status: 'pending' }).sort({ depositDate: -1 });

      return {
        success: true,
        data: confirmations
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
