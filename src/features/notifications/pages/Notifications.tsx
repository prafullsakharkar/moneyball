import React from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Bell, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'New Match Assigned', description: 'You have been assigned as captain for the upcoming match', timestamp: '2 min ago', type: 'info', read: false },
  { id: '2', title: 'Tournament Update', description: 'Tournament schedule has been updated', timestamp: '1 hour ago', type: 'info', read: false },
  { id: '3', title: 'Payment Received', description: 'Sponsorship payment of $5000 received', timestamp: '3 hours ago', type: 'success', read: true },
  { id: '4', title: 'Equipment Order', description: 'Your equipment order has been shipped', timestamp: '5 hours ago', type: 'success', read: true },
  { id: '5', title: 'Pending Approval', description: 'New player registration requires your approval', timestamp: '1 day ago', type: 'warning', read: true },
  { id: '6', title: 'System Maintenance', description: 'Scheduled maintenance tonight at 2 AM', timestamp: '2 days ago', type: 'info', read: true },
];

export function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your latest updates and alerts</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Showing {mockNotifications.length} notifications</span>
        <button className="px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-600 text-sm font-medium hover:bg-primary-500/20 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((notification) => (
          <GlassCard key={notification.id} className="p-4 hover:border-primary-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                notification.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                notification.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {notification.type === 'info' ? <Info className="w-5 h-5" /> :
                 notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                 notification.type === 'warning' ? <Clock className="w-5 h-5" /> :
                 <XCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-slate-500">{notification.timestamp}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{notification.description}</p>
                {!notification.read && (
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 ml-0"></span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default Notifications;