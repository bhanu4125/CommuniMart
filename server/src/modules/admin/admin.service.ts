import { User } from '../../models/User';
import { Product } from '../../models/Product';
import { Order } from '../../models/Order';
import { VerificationStatus, UserRole } from '../../types';

export class AdminService {
  static async getCommunityStats() {
    const [
      totalResidents,
      verifiedResidents,
      pendingResidents,
      totalListings,
      activeListings,
      completedOrders,
      allOrders
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ verificationStatus: 'verified' }),
      User.countDocuments({ verificationStatus: 'pending' }),
      Product.countDocuments(),
      Product.countDocuments({ available: true }),
      Order.countDocuments({ status: 'Completed' }),
      Order.find({ status: 'Completed' }).select('totalAmount')
    ]);

    const totalTransactionVolume = allOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
    // Estimated eco-impact: ~2.4 kg CO2 & landfill waste diverted per neighbor reuse/sharing transaction
    const wasteDivertedKg = Math.round(completedOrders * 3.5);

    // Block breakdown
    const blocks = await User.aggregate([
      { $group: { _id: '$block', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return {
      totalResidents,
      verifiedResidents,
      pendingResidents,
      totalListings,
      activeListings,
      completedOrders,
      totalTransactionVolume,
      wasteDivertedKg,
      blockDistribution: blocks
    };
  }

  static async getResidents() {
    return User.find().select('-passwordHash').sort({ createdAt: -1 });
  }

  static async updateResidentStatus(
    userId: string,
    verificationStatus: VerificationStatus,
    role?: UserRole,
    badges?: string[]
  ) {
    const update: any = { verificationStatus };
    if (role) update.role = role;
    if (badges) update.badges = badges;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-passwordHash');
    return user;
  }
}

