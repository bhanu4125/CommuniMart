export type UserRole = 'resident' | 'verified_seller' | 'committee_admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  phase: string;
  block: string;
  flatNumber: string;
  hideFlatNumber: boolean;
  verificationStatus: VerificationStatus;
  verificationCode?: string;
  badges: string[];
  rating: number;
  ratingCount: number;
  upiId?: string;
  joinedDate: string;
  bio?: string;
}

export type ListingMode = 'sell' | 'rent' | 'giveaway';
export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';
export type ItemCategory = 
  | 'Fresh Home Bakes & Meals'
  | 'Pre-loved Electronics'
  | 'Home & Furniture'
  | 'Kids & Toys'
  | 'Skill Exchange & Services'
  | 'Garden & Plants'
  | 'Books & Hobbies'
  | 'Tools & Utilities';

export type HandoverOption = 
  | 'Doorstep Delivery' 
  | 'Club House / Security Gate Drop-box' 
  | 'Direct Pickup from Seller Flat';

export type PaymentMethod = 'direct_upi' | 'cash_on_handover' | 'society_escrow';

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  category: ItemCategory;
  listingMode: ListingMode;
  price: number;
  rentDuration?: 'hour' | 'day' | 'week';
  rentDeposit?: number;
  condition?: ItemCondition;
  images: string[];
  seller: IUser;
  handoverOptions: HandoverOption[];
  available: boolean;
  block: string;
  tags: string[];
  views: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'Requested' 
  | 'Accepted by Neighbor' 
  | 'Ready for Handover' 
  | 'Completed' 
  | 'Cancelled';

export interface IOrder {
  _id: string;
  product: IProduct;
  buyer: IUser;
  seller: IUser;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'verified';
  handoverOption: HandoverOption;
  handoverNote?: string;
  totalAmount: number;
  upiReference?: string;
  requestedDates?: {
    startDate?: string;
    endDate?: string;
  };
  review?: {
    rating: number;
    comment: string;
    badgesAwarded: string[];
    createdAt: string;
  };
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  sender: IUser;
  recipient: IUser;
  product?: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    listingMode: ListingMode;
  };
  order?: string;
  text: string;
  isQuickReply?: boolean;
  read: boolean;
  createdAt: string;
}

export interface INotice {
  _id: string;
  author: IUser;
  title: string;
  description: string;
  category: 'Request / Borrow' | 'Flash Sale / Treat' | 'Notice / Alert' | 'Skill Offer';
  urgency: 'normal' | 'urgent';
  resolved: boolean;
  repliesCount: number;
  createdAt: string;
}
