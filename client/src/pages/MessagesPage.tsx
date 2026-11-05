import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCheck, 
  Search,
  UserCheck
} from 'lucide-react';
import { IUser, IMessage } from '../types';
import { chatAPI } from '../lib/api';
import { useAuthStore } from '../stores/useAuthStore';
import { useSocket } from '../context/SocketContext';
import { formatDate } from '../lib/utils';
import { sounds } from '../lib/sound';

const QUICK_REPLIES = [
  'Is this still available?',
  'Can I inspect this today?',
  'Left it at Gate 2 security desk',
  'Coming to your flat in 10 mins!'
];

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeContact?._id) {
      loadMessages(activeContact._id);
    }
  }, [activeContact?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: IMessage) => {
      if (
        (msg.sender._id === activeContact?._id && msg.recipient._id === user?._id) ||
        (msg.sender._id === user?._id && msg.recipient._id === activeContact?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }
      fetchConversations();
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleNewMessage);
    };
  }, [socket, activeContact?._id, user?._id]);

  const fetchConversations = async () => {
    try {
      setIsLoadingList(true);
      const res = await chatAPI.getConversations();
      if (res.data.success) {
        setConversations(res.data.data);
        if (!activeContact && res.data.data.length > 0) {
          setActiveContact(res.data.data[0].contact);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const loadMessages = async (contactId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await chatAPI.getMessages(contactId);
      if (res.data.success) {
        setMessages(res.data.data);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (customText?: string) => {
    const msgText = customText || text;
    if (!msgText.trim() || !activeContact?._id || !user?._id) return;

    sounds.playPop();

    if (socket) {
      socket.emit('send_message', {
        senderId: user._id,
        recipientId: activeContact._id,
        text: msgText.trim(),
        isQuickReply: !!customText
      });
    } else {
      await chatAPI.sendMessage({
        recipientId: activeContact._id,
        text: msgText.trim(),
        isQuickReply: !!customText
      });
      loadMessages(activeContact._id);
    }

    if (!customText) setText('');
  };

  return (
    <div className="glass-card rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden h-[75vh] flex pb-0 mb-20">
      {/* Left Column: Conversations List */}
      <div className="w-full sm:w-80 md:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-black text-zinc-900 dark:text-zinc-50 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-teal-600" />
            Resident Messenger
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Instant neighbor coordination & pickup chat
          </p>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {isLoadingList ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              <p className="text-xs">No active chats yet.</p>
              <p className="text-[10px] text-zinc-500 mt-1">
                Click "Chat" on any marketplace item to reach a neighbor.
              </p>
            </div>
          ) : (
            conversations.map((conv, idx) => {
              const contact = conv.contact;
              const isSelected = activeContact?._id === contact._id;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveContact(contact);
                    sounds.playPop();
                  }}
                  className={`w-full text-left p-3.5 flex items-center space-x-3 transition ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-l-4 border-teal-600'
                      : 'hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center">
                        {contact.name}
                        <ShieldCheck className="w-3 h-3 text-teal-600 ml-1 shrink-0" />
                      </p>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {conv.lastMessage && formatDate(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {conv.lastMessage?.text || 'Sent an attachment'}
                    </p>
                    <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                      {contact.block} • {contact.hideFlatNumber ? 'Masked' : contact.flatNumber}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
        {activeContact ? (
          <>
            {/* Active Contact Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeContact.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500"
                />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center">
                    {activeContact.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 ml-1" />
                  </h3>
                  <p className="text-[11px] text-zinc-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-0.5 text-teal-600" />
                    {activeContact.block} • {activeContact.hideFlatNumber ? 'Door Masked' : activeContact.flatNumber}
                  </p>
                </div>
              </div>

              {activeContact.badges && activeContact.badges.length > 0 && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {activeContact.badges[0]}
                </span>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-zinc-400">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    No messages yet with {activeContact.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Send a quick reply to start coordinating.
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
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs leading-relaxed shadow-xs ${
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

            {/* Quick Replies */}
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

            {/* Input */}
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
                  placeholder="Type a message to your neighbor..."
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-xs">
            Select a neighbor conversation on the left
          </div>
        )}
      </div>
    </div>
  );
};
