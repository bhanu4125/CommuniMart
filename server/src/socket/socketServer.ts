import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../modules/chat/chat.service';

export const initSocketServer = (httpServer: HttpServer, clientUrl: string) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // userId -> Set of socket IDs
  const onlineUsers = new Map<string, Set<string>>();

  io.on('connection', (socket: Socket) => {
    let currentUserId: string | null = null;

    socket.on('join_user', (userId: string) => {
      if (!userId) return;
      currentUserId = userId;
      socket.join(`user_${userId}`);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId)?.add(socket.id);

      io.emit('online_residents', Array.from(onlineUsers.keys()));
    });

    socket.on('send_message', async (data: {
      senderId: string;
      recipientId: string;
      text: string;
      productId?: string;
      orderId?: string;
      isQuickReply?: boolean;
    }) => {
      try {
        const savedMessage = await ChatService.sendMessage(data);

        // Emit to recipient's room
        io.to(`user_${data.recipientId}`).emit('new_message', savedMessage);
        // Also emit back to sender
        socket.emit('message_sent', savedMessage);
      } catch (err) {
        console.error('Socket message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data: { senderId: string; recipientId: string; isTyping: boolean }) => {
      io.to(`user_${data.recipientId}`).emit('user_typing', data);
    });

    socket.on('order_update', (data: { orderId: string; buyerId: string; sellerId: string; status: string }) => {
      io.to(`user_${data.buyerId}`).emit('order_status_changed', data);
      io.to(`user_${data.sellerId}`).emit('order_status_changed', data);
    });

    socket.on('item_ping', (data: { productId: string; sellerId: string; buyerName: string; title: string }) => {
      io.to(`user_${data.sellerId}`).emit('availability_ping', {
        productId: data.productId,
        buyerName: data.buyerName,
        title: data.title,
        message: `${data.buyerName} just checked availability for "${data.title}"`
      });
    });

    socket.on('disconnect', () => {
      if (currentUserId && onlineUsers.has(currentUserId)) {
        const set = onlineUsers.get(currentUserId);
        set?.delete(socket.id);
        if (set?.size === 0) {
          onlineUsers.delete(currentUserId);
        }
        io.emit('online_residents', Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
};
