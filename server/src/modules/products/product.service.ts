import { Product, IProductDocument } from '../../models/Product';
import { User } from '../../models/User';
import { escapeRegex } from '../../utils/escapeRegex';

export interface ProductFilterQuery {
  search?: string;
  category?: string;
  listingMode?: string;
  block?: string;
  condition?: string;
  available?: string;
  minPrice?: string;
  maxPrice?: string;
  sellerId?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export class ProductService {
  static async listProducts(query: ProductFilterQuery) {
    const filter: any = {};

    if (query.available !== 'all') {
      filter.available = query.available === 'false' ? false : true;
    }

    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    if (query.listingMode && query.listingMode !== 'all') {
      filter.listingMode = query.listingMode;
    }

    if (query.block && query.block !== 'All') {
      filter.block = query.block;
    }

    if (query.condition && query.condition !== 'All') {
      filter.condition = query.condition;
    }

    if (query.sellerId) {
      filter.seller = query.sellerId;
    }

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    if (query.search && query.search.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $in: [regex] } }
      ];
    }

    let sort: any = { createdAt: -1 };
    if (query.sortBy === 'price_asc') sort = { price: 1 };
    if (query.sortBy === 'price_desc') sort = { price: -1 };
    if (query.sortBy === 'popular') sort = { views: -1 };

    const products = await Product.find(filter)
      .populate('seller', 'name email phone avatar block flatNumber hideFlatNumber badges rating ratingCount upiId role')
      .sort(sort)
      .lean();

    // Mask flat number if seller enabled privacy toggle
    const sanitized = products.map((prod: any) => {
      if (prod.seller && prod.seller.hideFlatNumber) {
        prod.seller.flatNumber = 'Masked for Privacy (Revealed after order)';
      }
      return prod;
    });

    return sanitized;
  }

  static async getProductById(id: string) {
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('seller', 'name email phone avatar block flatNumber hideFlatNumber badges rating ratingCount upiId role joinedDate bio')
      .lean();

    if (!product) throw new Error('Product not found');

    const sanitized: any = { ...product };
    if (sanitized.seller && sanitized.seller.hideFlatNumber) {
      sanitized.seller.flatNumber = 'Masked for Privacy (Revealed after order)';
    }

    return sanitized;
  }

  static async createProduct(userId: string, data: any) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (!data.title || !data.title.trim()) {
      throw new Error('Title is required');
    }
    if (!data.description || !data.description.trim()) {
      throw new Error('Description is required');
    }

    const price = data.listingMode === 'giveaway' ? 0 : Number(data.price) || 0;
    const handoverOptions = (Array.isArray(data.handoverOptions) && data.handoverOptions.length > 0)
      ? data.handoverOptions
      : ['Doorstep Delivery', 'Club House / Security Gate Drop-box', 'Direct Pickup from Seller Flat'];

    const images = (Array.isArray(data.images) && data.images.filter(Boolean).length > 0)
      ? data.images.filter(Boolean)
      : ['https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600'];

    const product = await Product.create({
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category || 'Fresh Home Bakes & Meals',
      listingMode: data.listingMode || 'sell',
      price,
      rentDuration: data.listingMode === 'rent' ? data.rentDuration || 'day' : undefined,
      rentDeposit: data.listingMode === 'rent' ? Number(data.rentDeposit) || 0 : 0,
      condition: data.condition || 'Like New',
      images,
      handoverOptions,
      tags: Array.isArray(data.tags) ? data.tags : [],
      seller: userId,
      block: user.block || 'Tower A',
      available: true
    });

    return Product.findById(product._id).populate('seller', '-passwordHash');
  }

  static async updateProduct(userId: string, productId: string, data: any, userRole: string) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    if (product.seller.toString() !== userId && userRole !== 'committee_admin') {
      throw new Error('Unauthorized to modify this listing');
    }

    const updated = await Product.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true
    })
      .populate('seller', '-passwordHash');

    return updated;
  }

  static async deleteProduct(userId: string, productId: string, userRole: string) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    if (product.seller.toString() !== userId && userRole !== 'committee_admin') {
      throw new Error('Unauthorized to delete this listing');
    }

    await Product.findByIdAndDelete(productId);
    return { success: true };
  }

  static async toggleAvailability(userId: string, productId: string) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    if (product.seller.toString() !== userId) {
      throw new Error('Unauthorized to modify this listing');
    }

    product.available = !product.available;
    await product.save();

    return product;
  }
}
