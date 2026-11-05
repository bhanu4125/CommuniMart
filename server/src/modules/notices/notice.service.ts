import { Notice } from '../../models/Notice';

export class NoticeService {
  static async listNotices(category?: string) {
    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const notices = await Notice.find(filter)
      .populate('author', 'name avatar block flatNumber role')
      .sort({ urgency: -1, createdAt: -1 });

    return notices;
  }

  static async createNotice(userId: string, data: {
    title: string;
    description: string;
    category: 'Request / Borrow' | 'Flash Sale / Treat' | 'Notice / Alert' | 'Skill Offer';
    urgency?: 'normal' | 'urgent';
  }) {
    const notice = await Notice.create({
      author: userId,
      title: data.title,
      description: data.description,
      category: data.category,
      urgency: data.urgency || 'normal'
    });

    return Notice.findById(notice._id).populate('author', 'name avatar block flatNumber role');
  }

  static async toggleResolve(userId: string, noticeId: string, userRole?: string) {
    const notice = await Notice.findById(noticeId);
    if (!notice) throw new Error('Notice not found');

    if (notice.author.toString() !== userId && userRole !== 'committee_admin') {
      throw new Error('Unauthorized');
    }

    notice.resolved = !notice.resolved;
    await notice.save();

    return notice;
  }
}
