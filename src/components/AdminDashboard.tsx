import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Clock, CheckCircle, Circle, Trash2, LogOut, Shield } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const unreadCount = messages.filter(m => !m.read).length;

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
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                {unreadCount} unread
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-red-500 mb-4">Messages ({messages.length})</h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                        markAsRead(message.id);
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
                        <span className="font-semibold">{message.name}</span>
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
                    onClick={() => deleteMessage(selectedMessage.id)}
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
      </div>
    </div>
  );
}
