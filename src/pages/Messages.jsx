// src/pages/Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon as SearchIcon,
  PaperAirplaneIcon as SendIcon,
  UserCircleIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisHorizontalIcon as MenuDotsIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';

// ---------------------------
// MOCK DATA (no API)
// ---------------------------

// Mock current user (for display)
const mockUser = {
  id: 'u1',
  name: 'Alex Johnson',
  avatar: null, // or an image URL
};

// Mock conversations (each tied to a booking)
const mockConversations = [
  {
    id: 'c1',
    bookingId: 'b1',
    serviceName: 'Pipe Repair',
    providerName: 'John\'s Plumbing',
    providerAvatar: null,
    lastMessage: 'I\'ll be there by 2 PM.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'p1', // provider
        text: 'Hi, I\'m on my way to your location.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
      },
      {
        id: 'm2',
        senderId: 'u1', // client
        text: 'Great! I\'ll be home.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 'p1',
        text: 'I\'ll be there by 2 PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
      },
      {
        id: 'm4',
        senderId: 'p1',
        text: 'Do you have any parking instructions?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        isRead: false,
      },
    ],
  },
  {
    id: 'c2',
    bookingId: 'b2',
    serviceName: 'Electrical Wiring',
    providerName: 'Spark Electric',
    providerAvatar: null,
    lastMessage: 'All set for tomorrow.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        senderId: 'p2',
        text: 'I\'ve reviewed the job details.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: true,
      },
      {
        id: 'm6',
        senderId: 'u1',
        text: 'All set for tomorrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: true,
      },
    ],
  },
  {
    id: 'c3',
    bookingId: 'b3',
    serviceName: 'House Cleaning',
    providerName: 'Clean & Shine',
    providerAvatar: null,
    lastMessage: 'Please confirm the time slot.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    messages: [
      {
        id: 'm7',
        senderId: 'p3',
        text: 'We are available at 10 AM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
        isRead: true,
      },
      {
        id: 'm8',
        senderId: 'u1',
        text: 'That works for me.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true,
      },
      {
        id: 'm9',
        senderId: 'p3',
        text: 'Please confirm the time slot.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
        isRead: false,
      },
    ],
  },
];

// ---------------------------
// MAIN COMPONENT
// ---------------------------

const Messages = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedConversation]);

  // Focus input on conversation select
  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedConversation]);

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    conv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending a new message (mock)
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Create new message
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: 'u1', // current user
      text: newMessage.trim(),
      timestamp: new Date(),
      isRead: true,
    };

    // Update conversation
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        const updated = { ...conv };
        updated.messages = [...updated.messages, newMsg];
        updated.lastMessage = newMsg.text;
        updated.lastMessageTime = newMsg.timestamp;
        updated.unreadCount = 0; // user reads own message
        return updated;
      }
      return conv;
    });
    setConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find((c) => c.id === selectedConversation.id)
    );
    setNewMessage('');

    // Simulate provider reply after 1-3 seconds
    const replyDelay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      const autoReplies = [
        'Got it!',
        'Thanks for the update.',
        'I\'ll be there soon.',
        'Perfect, see you then.',
        'Any questions?',
        'Sure, no problem.',
        'OK, I understand.',
        'Let me check and get back to you.',
      ];
      const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMsg = {
        id: `m${Date.now() + 1}`,
        senderId: selectedConversation.id === 'c1' ? 'p1' : 
                   selectedConversation.id === 'c2' ? 'p2' : 'p3',
        text: replyText,
        timestamp: new Date(),
        isRead: false,
      };

      const updatedWithReply = updatedConversations.map((conv) => {
        if (conv.id === selectedConversation.id) {
          const updated = { ...conv };
          updated.messages = [...updated.messages, replyMsg];
          updated.lastMessage = replyMsg.text;
          updated.lastMessageTime = replyMsg.timestamp;
          updated.unreadCount = 1; // provider unread
          return updated;
        }
        return conv;
      });
      setConversations(updatedWithReply);
      setSelectedConversation(
        updatedWithReply.find((c) => c.id === selectedConversation.id)
      );
    }, replyDelay);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mark conversation as read when selected
  const handleSelectConversation = (conv) => {
    // Mark unread as read
    const updated = conversations.map((c) => {
      if (c.id === conv.id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    });
    setConversations(updated);
    setSelectedConversation(updated.find((c) => c.id === conv.id));
    if (isMobileView) {
      // On mobile, we could hide the list, but we'll keep it for simplicity
    }
  };

  // Determine if current user is sender
  const isCurrentUser = (msg) => msg.senderId === 'u1';

  // Render message list (for selected conversation)
  const renderMessages = () => {
    if (!selectedConversation) return null;
    const { messages, providerName, serviceName } = selectedConversation;

    return (
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {isMobileView && (
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{providerName}</div>
              <div className="text-xs text-gray-500">{serviceName}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <VideoCameraIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <MenuDotsIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages container */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
        >
          {messages.map((msg) => {
            const isSender = isCurrentUser(msg);
            return (
              <div
                key={msg.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isSender
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversation list (left panel) */}
            <div
              className={`${
                isMobileView && selectedConversation ? 'hidden' : 'w-full md:w-1/3'
              } md:w-1/3 border-r border-gray-200 flex flex-col`}
            >
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Conversation items */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No conversations found.
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                        selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                          <UserCircleIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {conv.providerName}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatDistanceToNow(conv.lastMessageTime, { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat area (right panel) */}
            <div
              className={`${
                isMobileView && !selectedConversation ? 'hidden' : 'flex-1'
              } md:flex-1 flex flex-col`}
            >
              {selectedConversation ? (
                renderMessages()
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <UserCircleIcon className="w-16 h-16 mx-auto text-gray-300" />
                    <p className="mt-2">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;