import React, { createContext, useContext, useState } from 'react';
import { NotificationItem } from '../types';
import { mockNotifications } from '../data/mockData';

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type'], recipientRole?: NotificationItem['recipientRole']) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'system',
    recipientRole: NotificationItem['recipientRole'] = 'patient'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientRole,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllRead,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
