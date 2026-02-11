import { User } from '../models/User';

class AdminService {
  async getStats() {
    try {
      const totalUsers = await User.countDocuments();
      const totalAdmins = await User.countDocuments({ isAdmin: true });

      // These would need actual transaction data from your database
      const totalTransactions = 0; // Placeholder
      const totalTransactionVolume = 0; // Placeholder

      return {
        totalUsers,
        totalAdmins,
        totalTransactions,
        totalTransactionVolume
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch stats');
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find({}, '-password -twoFactorSecret -backupCodes')
        .sort({ createdAt: -1 })
        .lean();
      
      return users;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  async getUser(userId: string) {
    try {
      const user = await User.findById(userId, '-password -twoFactorSecret -backupCodes').lean();
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  }

  async makeUserAdmin(userId: string) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isAdmin: true },
        { new: true }
      ).select('-password -twoFactorSecret -backupCodes');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  async getAllTransactions() {
    try {
      // Placeholder - implement based on your transaction model
      // const transactions = await Transaction.find()
      //   .sort({ createdAt: -1 })
      //   .lean();
      
      // For now, return empty array
      return [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch transactions');
    }
  }

  async updateUserDetails(userId: string, updates: any) {
    try {
      const allowedUpdates = ['firstName', 'lastName', 'phone'];
      const updateData: any = {};

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updateData[key] = updates[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).select('-password -twoFactorSecret -backupCodes');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    }
  }
}

export const adminService = new AdminService();
