import crypto from 'crypto';
import { LoginApproval } from '../models/LoginApproval';

export class LoginApprovalService {
  static async createLoginApproval(userId: string, ipAddress: string, userAgent: string, deviceName?: string) {
    try {
      const approvalToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const approval = new LoginApproval({
        userId,
        ipAddress,
        userAgent,
        deviceName,
        approvalToken,
        expiresAt,
        status: 'pending'
      });

      await approval.save();
      return {
        success: true,
        message: 'Login approval request created',
        approvalToken
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async approveLogin(approvalToken: string) {
    try {
      const approval = await LoginApproval.findOne({ approvalToken });

      if (!approval) {
        return {
          success: false,
          error: 'Invalid approval token'
        };
      }

      if (approval.status !== 'pending') {
        return {
          success: false,
          error: 'Approval request is no longer pending'
        };
      }

      if (new Date() > approval.expiresAt) {
        approval.status = 'expired';
        await approval.save();
        return {
          success: false,
          error: 'Approval token has expired'
        };
      }

      approval.status = 'approved';
      approval.approvedAt = new Date();
      await approval.save();

      return {
        success: true,
        message: 'Login approved',
        userId: approval.userId
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async rejectLogin(approvalToken: string, rejectionReason: string) {
    try {
      const approval = await LoginApproval.findOne({ approvalToken });

      if (!approval) {
        return {
          success: false,
          error: 'Invalid approval token'
        };
      }

      approval.status = 'rejected';
      approval.rejectedAt = new Date();
      approval.rejectionReason = rejectionReason;
      await approval.save();

      return {
        success: true,
        message: 'Login rejected'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPendingApprovals(userId: string) {
    try {
      const approvals = await LoginApproval.find({
        userId,
        status: 'pending'
      }).sort({ createdAt: -1 });

      return {
        success: true,
        data: approvals
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
