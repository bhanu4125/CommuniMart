import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../../models/User';
import { UserRole } from '../../types';

export const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_communimart_jwt_key_2025_society_token_secure';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    phase: string;
    block: string;
    flatNumber: string;
    hideFlatNumber?: boolean;
    verificationCode?: string;
    role?: UserRole;
    upiId?: string;
  }) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new Error('A resident with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Auto verify if valid society invite code or standard demo
    const isAutoVerified = data.verificationCode === 'COMMUNITY2025' || !data.verificationCode;

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      phone: data.phone,
      phase: data.phase || 'Phase 1 - Green Meadows',
      block: data.block,
      flatNumber: data.flatNumber,
      hideFlatNumber: data.hideFlatNumber ?? false,
      role: data.role || 'resident',
      verificationStatus: isAutoVerified ? 'verified' : 'pending',
      verificationCode: data.verificationCode,
      upiId: data.upiId || `${data.phone}@upi`,
      badges: ['Verified Resident']
    });

    const token = signToken(user._id.toString());
    const userSafe = await User.findById(user._id).select('-passwordHash');

    return { user: userSafe, token };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = signToken(user._id.toString());
    const userSafe = await User.findById(user._id).select('-passwordHash');

    return { user: userSafe, token };
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateProfile(userId: string, data: Partial<IUserDocument>) {
    const allowed = ['name', 'phone', 'hideFlatNumber', 'avatar', 'upiId', 'bio', 'block', 'flatNumber'];
    const updateData: any = {};
    for (const key of allowed) {
      if ((data as any)[key] !== undefined) {
        updateData[key] = (data as any)[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-passwordHash');
    return user;
  }

  static async demoLogin(role: UserRole = 'resident') {
    // Find a demo user matching this role or create one
    let user: any = await User.findOne({ role }).select('-passwordHash');
    if (!user) {
      user = await User.findOne().select('-passwordHash');
    }
    if (!user) {
      throw new Error('No users seeded yet. Please run database seed.');
    }

    const token = signToken(user._id.toString());
    return { user, token };
  }
}
