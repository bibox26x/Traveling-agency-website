import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactMessages() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/contact/messages', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast.error(t('admin.contact.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.contact.deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter(msg => msg.id !== id));
      toast.success(t('admin.contact.deleteSuccess'));
    } catch (error) {
      toast.error(t('admin.contact.deleteError'));
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/contact/messages/${id}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      toast.error(t('admin.contact.markReadError'));
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t('admin.contact.title')}
      </h2>

      {messages.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          {t('admin.contact.noMessages')}
        </p>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`border rounded-lg p-4 ${
                message.isRead ? 'bg-gray-50' : 'bg-white border-primary-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('admin.contact.from')}: {message.name} ({message.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(message.createdAt), 'PPpp')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!message.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(message.id)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {t('admin.contact.markAsRead')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    {t('admin.contact.delete')}
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 