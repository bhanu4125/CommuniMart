import { Message } from '../../models/Message';
import { User } from '../../models/User';
import mongoose from 'mongoose';

export class ChatService {
  static async getConversations(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregate latest message for each distinct conversation
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { recipient: userObjectId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gt: ['$sender', '$recipient'] },
              { sender: '$sender', recipient: '$recipient' },
              { sender: '$recipient', recipient: '$sender' }
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    const contactIds = messages.map(m => {
      const isSender = m.lastMessage.sender.toString() === userId;
      return isSender ? m.lastMessage.recipient : m.lastMessage.sender;
    });

    const contacts = await User.find({ _id: { $in: contactIds } })
      .select('name avatar block flatNumber hideFlatNumber rating role badges')
      .lean();

    const contactMap = new Map(contacts.map(c => [c._id.toString(), c]));

    const conversations = messages.map(m => {
      const isSender = m.lastMessage.sender.toString() === userId;
      const contactId = isSender ? m.lastMessage.recipient.toString() : m.lastMessage.sender.toString();
      const contact = contactMap.get(contactId);

      return {
        contact,
        lastMessage: m.lastMessage
      };
    });

    return conversations.filter(c => c.contact);
  }

  static async getMessages(userId: string, contactId: string, productId?: string) {
    const query: any = {
      $or: [
        { sender: userId, recipient: contactId },
        { sender: contactId, recipient: userId }
      ]
    };

    if (productId) {
      query.product = productId;
    }

    const messages = await Message.find(query)
      .populate('sender', 'name avatar block flatNumber')
      .populate('recipient', 'name avatar block flatNumber')
      .populate('product', 'title price images listingMode')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: contactId, recipient: userId, read: false },
      { $set: { read: true } }
    );

    return messages;
  }

  static async sendMessage(data: {
    senderId: string;
    recipientId: string;
    text: string;
    productId?: string;
    orderId?: string;
    isQuickReply?: boolean;
  }) {
    const message = await Message.create({
      sender: data.senderId,
      recipient: data.recipientId,
      text: data.text,
      product: data.productId || undefined,
      order: data.orderId || undefined,
      isQuickReply: data.isQuickReply || false
    });

    return Message.findById(message._id)
      .populate('sender', 'name avatar block flatNumber')
      .populate('recipient', 'name avatar block flatNumber')
      .populate('product', 'title price images listingMode');
  }
}
