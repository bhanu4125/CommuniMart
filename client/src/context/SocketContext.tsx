import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'sonner';
import { sounds } from '../lib/sound';

interface SocketContextType {
  socket: Socket | null;
  onlineResidents: string[];
  sendItemPing: (productId: string, sellerId: string, title: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineResidents: [],
  sendItemPing: () => {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineResidents, setOnlineResidents] = useState<string[]>([]);

  useEffect(() => {
    const s = io(window.location.origin, {
      path: '/socket.io',
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(s);

    s.on('connect', () => {
      if (user?._id) {
        s.emit('join_user', user._id);
      }
    });

    s.on('online_residents', (list: string[]) => {
      setOnlineResidents(list);
    });

    s.on('new_message', (msg: any) => {
      sounds.playPing();
      toast.info(`New message from ${msg.sender.name}`, {
        description: msg.text,
        duration: 4000
      });
    });

    s.on('availability_ping', (data: any) => {
      sounds.playPing();
      toast(`🔔 Neighbor Ping: ${data.buyerName}`, {
        description: data.message,
        duration: 5000
      });
    });

    s.on('order_status_changed', (data: any) => {
      sounds.playSuccess();
      toast.success('Order Status Updated', {
        description: `Order #${data.orderId.slice(-6)} is now: ${data.status}`
      });
    });

    return () => {
      s.disconnect();
    };
  }, [user?._id]);

  const sendItemPing = (productId: string, sellerId: string, title: string) => {
    if (socket && user) {
      socket.emit('item_ping', {
        productId,
        sellerId,
        buyerName: user.name,
        title
      });
      sounds.playPop();
      toast.success('Availability ping sent!', {
        description: 'The neighbor has been notified on their device.'
      });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlineResidents, sendItemPing }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
