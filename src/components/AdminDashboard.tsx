import React, { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle, Circle, Trash2, LogOut, Shield, Users } from 'lucide-react';
import { getContactMessages, markMessageAsRead, deleteContactMessage, ContactMessage } from '../lib/supabase';

export function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      setMessages(messages.map(m =>
        m.id === id ? { ...m, read: true } : m
      ));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const unreadCount = messages.filter(m => !m.read).length;

  const uniqueUsers = Array.from(
    new Map(
      messages.map(msg => [msg.email, { name: msg.name, email: msg.email }])
    ).values()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-900 border-b border-red-900 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                {unreadCount} new
              </span>
            )}
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300"
          >
            <LogOut className="w-4 h-4" />
            Back to Portfolio
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 font-semibold transition-colors duration-300 border-b-2 ${
              activeTab === 'messages'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Messages ({messages.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-colors duration-300 border-b-2 ${
              activeTab === 'users'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contacts ({uniqueUsers.length})
            </div>
          </button>
        </div>

        {activeTab === 'messages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-red-500 mb-4">Inbox ({messages.length})</h2>
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center text-gray-400">
                    No messages yet
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.read) {
                          handleMarkAsRead(message.id);
                        }
                      }}
                      className={`
                        p-4 rounded-lg border cursor-pointer transition-all duration-300
                        ${selectedMessage?.id === message.id
                          ? 'bg-red-900/20 border-red-600'
                          : message.read
                          ? 'bg-gray-900 border-gray-700 hover:border-gray-600'
                          : 'bg-gray-900 border-red-600/50 hover:border-red-600'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-red-500" />
                          <span className="font-semibold text-sm">{message.name}</span>
                        </div>
                        {message.read ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate mb-2">{message.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedMessage.name}</h3>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-red-500 hover:text-red-400 transition-colors duration-300"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <Clock className="w-4 h-4" />
                      Received: {formatDate(selectedMessage.created_at)}
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},%0D%0A%0D%0A`}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-center font-semibold transition-colors duration-300"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`https://wa.me/?text=Hi ${selectedMessage.name}, I received your message from the portfolio contact form.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-center font-semibold transition-colors duration-300"
                    >
                      Reply via WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 p-12 rounded-lg border border-gray-700 flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <Mail className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p>Select a message to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-6">Contact List</h2>
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {uniqueUsers.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No contacts yet
                  </div>
                ) : (
                  uniqueUsers.map((user, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-red-600 transition-colors duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{user.name}</h3>
                          <a
                            href={`mailto:${user.email}`}
                            className="text-red-500 hover:text-red-400 transition-colors duration-300 text-sm"
                          >
                            {user.email}
                          </a>
                        </div>
                        <Mail className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Messages: {messages.filter(m => m.email === user.email).length}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-gray-400 mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Total Messages</div>
                  <div className="text-3xl font-bold text-red-500">{messages.length}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Unread Messages</div>
                  <div className="text-3xl font-bold text-red-500">{unreadCount}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Unique Contacts</div>
                  <div className="text-3xl font-bold text-red-500">{uniqueUsers.length}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Read Messages</div>
                  <div className="text-3xl font-bold text-green-500">{messages.filter(m => m.read).length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
