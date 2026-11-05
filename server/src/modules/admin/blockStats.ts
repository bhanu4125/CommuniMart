import { User } from '../../models/User';
import { Product } from '../../models/Product';

export const getBlockSummary = async () => {
  const residentCounts = await User.aggregate([
    { $group: { _id: '$block', count: { $sum: 1 } } }
  ]);

  const listingCounts = await Product.aggregate([
    { $group: { _id: '$block', count: { $sum: 1 } } }
  ]);

  return { residentCounts, listingCounts };
};
