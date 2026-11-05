import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCheck, 
  MessageSquare 
} from 'lucide-react';
import { IProduct, IMessage, IUser } from '../types';
import { chatAPI } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { useSocket } from '../context/SocketContext';
import { formatINR, formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: IUser | null;
  product?: IProduct | null;
  orderId?: string;
}

const QUICK_REPLIES = [
  'Is this still available?',
  'Can I inspect this today?',
  'Left it at Gate 2 security desk',
  'Coming to your flat in 10 mins!'
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  contact,
  product,
  orderId
}) => {
  const { user } = useAuthStore();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contact?._id) {
      loadMessages();
    }
  }, [isOpen, contact?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: IMessage) => {
      if (
        (msg.sender._id === contact?._id && msg.recipient._id === user?._id) ||
        (msg.sender._id === user?._id && msg.recipient._id === contact?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleNewMessage);
    };
  }, [socket, contact?._id, user?._id]);

  const loadMessages = async () => {
    if (!contact?._id) return;
    try {
      setIsLoading(true);
      const res = await chatAPI.getMessages(contact._id, product?._id);
      if (res.data.success) {
        setMessages(res.data.data);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (customText?: string) => {
    const msgText = customText || text;
    if (!msgText.trim() || !contact?._id || !user?._id) return;

    sounds.playPop();

    if (socket) {
      socket.emit('send_message', {
        senderId: user._id,
        recipientId: contact._id,
        text: msgText.trim(),
        productId: product?._id,
        orderId,
        isQuickReply: !!customText
      });
    } else {
      await chatAPI.sendMessage({
        recipientId: contact._id,
        text: msgText.trim(),
        productId: product?._id,
        orderId,
        isQuickReply: !!customText
      });
      loadMessages();
    }

    if (!customText) setText('');
  };

  if (!isOpen || !contact) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={contact.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                      {contact.name}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <p className="text-[11px] text-zinc-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-0.5 text-teal-600" />
                    {contact.block} • {contact.hideFlatNumber ? 'Flat Masked' : contact.flatNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Linked Item Context banner if linked */}
            {product && (
              <div className="px-4 py-2.5 bg-teal-50/80 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 truncate">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {product.title}
                    </p>
                    <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold">
                      {formatINR(product.price)}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold shrink-0">
                  Item Context
                </span>
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-xs text-zinc-400">Loading conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <MessageSquare className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Direct Society Chat
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 max-w-[240px]">
                    Send a quick reply below or type your message to coordinate pickup with {contact.name}.
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender._id === user?._id;
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5 px-1">
                        <span className="text-[9px] text-zinc-400">
                          {formatDate(m.createdAt)}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-teal-600" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Carousel */}
            <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(reply)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-teal-500 hover:text-teal-600 transition shadow-xs active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Type message to neighbor..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

