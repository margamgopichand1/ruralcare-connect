import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, AlertTriangle, FileText, HeartPulse } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-health-500"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl bg-white border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
            <div className="p-3 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-health-100 text-health-800 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-health-700 hover:text-health-900 transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 transition cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                      !n.read ? 'bg-health-50/50' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'sos' ? (
                        <div className="p-1.5 rounded-full bg-red-100 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : n.type === 'record' ? (
                        <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                          <FileText className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-600">
                          <HeartPulse className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
