import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, AlertTriangle, CheckCircle2, Info, Clock, Rocket, FileText, X, Filter, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, isDocDebt } from '../context/AppContext';

type NType = 'alert' | 'info' | 'success';
type NFilter = 'all' | NType;

interface Notification {
  id: string;
  type: NType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
}

function buildNotifications(
  docDebtCount: number,
  taskCount: number,
  hireName: string | null,
  launched: boolean
): Notification[] {
  const items: Notification[] = [];

  if (docDebtCount > 0) {
    items.push({
      id: 'dd-1',
      type: 'alert',
      title: 'Doc Debt Detected',
      body: `${docDebtCount} task${docDebtCount > 1 ? 's' : ''} in ${hireName ?? 'your plan'}'s roadmap are missing documentation. Resolve before launching.`,
      time: '2m ago',
      read: false,
      icon: AlertTriangle,
    });
  }

  if (launched) {
    items.push({
      id: 'launch-1',
      type: 'success',
      title: 'Roadmap Launched',
      body: `${hireName ?? 'Your new hire'}'s onboarding plan is live. They can now access their checklist and view their roadmap.`,
      time: '1h ago',
      read: false,
      icon: Rocket,
    });
  }

  items.push({
    id: 'gen-1',
    type: 'success',
    title: 'Roadmap Generated',
    body: `A ${taskCount}-task onboarding plan was created for ${hireName ?? 'your new hire'} based on their role template.`,
    time: '2h ago',
    read: true,
    icon: CheckCircle2,
  });

  items.push({
    id: 'info-1',
    type: 'info',
    title: 'Week 1 Tasks Due Soon',
    body: `${hireName ?? 'Your new hire'} has ${Math.min(taskCount, 6)} tasks due in Week 1. Make sure all docs and access are in place before day one.`,
    time: '3h ago',
    read: true,
    icon: Clock,
  });

  items.push({
    id: 'info-2',
    type: 'info',
    title: 'Team Setup Reminder',
    body: 'Add onboarding contacts and team members to ensure your new hire has a complete support network from day one.',
    time: '1d ago',
    read: true,
    icon: Info,
  });

  items.push({
    id: 'info-3',
    type: 'info',
    title: 'Tip: Use the Filter Bar',
    body: 'You can filter tasks by Tech Setup, Doc Debt, Overdue, and more to quickly focus on what needs attention.',
    time: '2d ago',
    read: true,
    icon: FileText,
  });

  items.push({
    id: 'success-2',
    type: 'success',
    title: 'Welcome to LaunchPath',
    body: 'You\'ve joined LaunchPath. Use the Onboarding Wizard to create your first new hire roadmap in minutes.',
    time: '3d ago',
    read: true,
    icon: CheckCircle2,
  });

  return items;
}

const TYPE_CONFIG: Record<NType, { bg: string; border: string; dot: string; label: string }> = {
  alert:   { bg: 'bg-amber-50',  border: 'border-amber-100',  dot: 'bg-amber-500',  label: 'Alert'   },
  info:    { bg: 'bg-blue-50',   border: 'border-blue-100',   dot: 'bg-blue-500',   label: 'Info'    },
  success: { bg: 'bg-gray-50',  border: 'border-gray-200',  dot: 'bg-gray-800',  label: 'Success' },
};

const ICON_COLORS: Record<NType, string> = {
  alert:   'text-amber-600',
  info:    'text-blue-600',
  success: 'text-gray-900',
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { tasks, hireInfo, launched } = useApp();
  const docDebtCount = tasks.filter(t => isDocDebt(t)).length;
  const [filter, setFilter] = useState<NFilter>('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  const allNotifications = buildNotifications(docDebtCount, tasks.length, hireInfo?.name ?? null, launched);
  const visible = allNotifications.filter(n => !dismissed.has(n.id));
  const filtered = filter === 'all' ? visible : visible.filter(n => n.type === filter);
  const unreadCount = visible.filter(n => !n.read && !readSet.has(n.id)).length;

  function markAllRead() {
    setReadSet(new Set(allNotifications.map(n => n.id)));
  }

  function dismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]));
  }

  function markRead(id: string) {
    setReadSet(prev => new Set([...prev, id]));
  }

  const FILTERS: { key: NFilter; label: string; count: number }[] = [
    { key: 'all',     label: 'All',      count: visible.length },
    { key: 'alert',   label: 'Alerts',   count: visible.filter(n => n.type === 'alert').length },
    { key: 'info',    label: 'Info',     count: visible.filter(n => n.type === 'info').length },
    { key: 'success', label: 'Success',  count: visible.filter(n => n.type === 'success').length },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className="font-mono-label text-gray-400 mb-1">launchpath / notifications</p>
            <h1 className="text-gray-900 leading-none">Notifications</h1>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'all caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-sm text-gray-900 hover:text-gray-900 font-medium px-3 py-1.5 rounded-sm hover:bg-gray-50 transition-colors">
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <div className="flex gap-1">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
                  filter === f.key
                    ? 'bg-gray-800 border-gray-800 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold ${
                  filter === f.key ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                }`}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="empty-state">
                <p className="empty-state-tag">inbox / clear</p>
                <div className="empty-state-icon">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="empty-state-title">All quiet here</p>
                <p className="empty-state-body">No alerts or updates for this filter. Doc debt and launch events will surface here.</p>
              </motion.div>
            ) : (
              filtered.map(n => {
                const cfg = TYPE_CONFIG[n.type];
                const Icon = n.icon;
                const isUnread = !n.read && !readSet.has(n.id);
                return (
                  <motion.div key={n.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                    onClick={() => markRead(n.id)}
                    className={`relative flex items-start gap-4 p-4 rounded-sm border cursor-pointer transition-all hover:shadow-sm ${cfg.bg} ${cfg.border} ${isUnread ? 'shadow-sm' : ''}`}>
                    {/* Unread dot */}
                    {isUnread && (
                      <div className={`absolute top-4 right-4 w-2 h-2 rounded-sm ${cfg.dot}`} />
                    )}

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 bg-white/60 backdrop-blur-sm border ${cfg.border}`}>
                      <Icon className={`w-4 h-4 ${ICON_COLORS[n.type]}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-semibold text-gray-800 ${isUnread ? '' : 'opacity-70'}`}>{n.title}</p>
                      </div>
                      <p className={`text-sm text-gray-500 leading-relaxed ${isUnread ? '' : 'opacity-70'}`}>{n.body}</p>
                      <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
                    </div>

                    {/* Dismiss */}
                    <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      className="absolute top-3 right-3 p-1 rounded-sm hover:bg-white/60 transition-colors text-gray-300 hover:text-gray-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Clear all */}
        {visible.length > 0 && (
          <div className="flex justify-center pt-2">
            <button onClick={() => setDismissed(new Set(allNotifications.map(n => n.id)))}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-sm hover:bg-red-50">
              <Trash2 className="w-3 h-3" />Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
