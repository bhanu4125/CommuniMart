import { Order } from '../../models/Order';
import { Product } from '../../models/Product';
import { User } from '../../models/User';
import { OrderStatus, HandoverOption, PaymentMethod } from '../../types';

export class OrderService {
  static async createOrder(data: {
    productId: string;
    buyerId: string;
    paymentMethod: PaymentMethod;
    handoverOption: HandoverOption;
    handoverNote?: string;
    requestedDates?: { startDate?: Date; endDate?: Date };
  }) {
    const product = await Product.findById(data.productId).populate('seller');
    if (!product) throw new Error('Product not found');
    if (!product.available) throw new Error('This item is no longer available');

    if (product.seller._id.toString() === data.buyerId) {
      throw new Error('You cannot purchase or rent your own listing');
    }

    const upiRef = `CM-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      product: product._id,
      buyer: data.buyerId,
      seller: product.seller._id,
      status: 'Requested',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'direct_upi' ? 'pending' : 'pending',
      handoverOption: data.handoverOption,
      handoverNote: data.handoverNote || '',
      totalAmount: product.price,
      upiReference: upiRef,
      requestedDates: data.requestedDates,
      timeline: [
        {
          status: 'Requested',
          timestamp: new Date(),
          note: `Order placed via ${data.handoverOption} using ${data.paymentMethod}`
        }
      ]
    });

    return Order.findById(order._id)
      .populate('product')
      .populate('buyer', 'name email phone block flatNumber hideFlatNumber avatar upiId')
      .populate('seller', 'name email phone block flatNumber hideFlatNumber avatar upiId');
  }

  static async updateOrderStatus(
    userId: string,
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    userRole?: string
  ) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    const isBuyer = order.buyer.toString() === userId;
    const isSeller = order.seller.toString() === userId;
    const isAdmin = userRole === 'committee_admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new Error('Unauthorized to update this order');
    }

    // Status transition validation
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      Requested: ['Accepted by Neighbor', 'Cancelled'],
      'Accepted by Neighbor': ['Ready for Handover', 'Cancelled'],
      'Ready for Handover': ['Completed', 'Cancelled'],
      Completed: [],
      Cancelled: []
    };

    if (!allowedTransitions[order.status]?.includes(newStatus) && !isAdmin) {
      throw new Error(`Invalid transition from "${order.status}" to "${newStatus}"`);
    }

    // Role-specific constraints
    if (newStatus === 'Accepted by Neighbor' && !isSeller && !isAdmin) {
      throw new Error('Only the seller can accept the order request');
    }

    if (newStatus === 'Ready for Handover' && !isSeller && !isAdmin) {
      throw new Error('Only the seller can mark the item as ready for handover');
    }

    order.status = newStatus;
    if (newStatus === 'Completed') {
      order.paymentStatus = 'paid';
      // Mark product as not available if sell mode
      const prod = await Product.findById(order.product);
      if (prod && prod.listingMode === 'sell') {
        prod.available = false;
        await prod.save();
      }
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Order updated to ${newStatus}`
    });

    await order.save();

    return Order.findById(order._id)
      .populate('product')
      .populate('buyer', 'name email phone block flatNumber hideFlatNumber avatar upiId')
      .populate('seller', 'name email phone block flatNumber hideFlatNumber avatar upiId');
  }

  static async markPaymentPaid(userId: string, orderId: string, upiReference?: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.buyer.toString() !== userId && order.seller.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    order.paymentStatus = 'paid';
    if (upiReference) {
      order.upiReference = upiReference;
    }
    order.timeline.push({
      status: order.status,
      timestamp: new Date(),
      note: `Payment confirmed via UPI/Escrow (Ref: ${order.upiReference})`
    });

    await order.save();
    return order;
  }

  static async addReview(
    userId: string,
    orderId: string,
    rating: number,
    comment: string,
    badgesAwarded: string[] = []
  ) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.buyer.toString() !== userId) {
      throw new Error('Only the buyer can review this order');
    }

    if (order.status !== 'Completed') {
      throw new Error('Only completed orders can be reviewed');
    }

    order.review = {
      rating,
      comment,
      badgesAwarded,
      createdAt: new Date()
    };

    await order.save();

    // Update seller's rating & badges
    const seller = await User.findById(order.seller);
    if (seller) {
      const newCount = (seller.ratingCount || 1) + 1;
      const newRating = Number((((seller.rating || 5) * (seller.ratingCount || 1) + rating) / newCount).toFixed(1));
      seller.rating = newRating;
      seller.ratingCount = newCount;

      if (badgesAwarded && badgesAwarded.length > 0) {
        const set = new Set([...(seller.badges || []), ...badgesAwarded]);
        seller.badges = Array.from(set);
      }
      await seller.save();
    }

    return order;
  }

  static async getOrderById(userId: string, orderId: string, userRole?: string) {
    const order = await Order.findById(orderId)
      .populate('product')
      .populate('buyer', 'name email phone block flatNumber avatar upiId role')
      .populate('seller', 'name email phone block flatNumber avatar upiId role');

    if (!order) throw new Error('Order not found');

    const isParty = 
      order.buyer._id.toString() === userId || 
      order.seller._id.toString() === userId || 
      userRole === 'committee_admin';

    if (!isParty) {
      throw new Error('Unauthorized to view this order');
    }

    return order;
  }

  static async getMyOrders(userId: string) {
    const orders = await Order.find({
      $or: [{ buyer: userId }, { seller: userId }]
    })
      .populate('product')
      .populate('buyer', 'name email phone block flatNumber avatar')
      .populate('seller', 'name email phone block flatNumber avatar upiId')
      .sort({ createdAt: -1 });

    return orders;
  }
}
