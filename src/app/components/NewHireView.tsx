import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2, Circle, ExternalLink, Calendar, User, AlertCircle,
  Clock, ChevronRight, PartyPopper, ArrowLeft, Wrench, Link2,
  TrendingUp, List, Flag, Mail, UserCheck, Network, Eye, Pencil
} from 'lucide-react';
import NewHirePreview from './NewHirePreview';
import { useApp, Task, Week, TeamContact, isDocDebt } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

import { getWeeksList } from './roadmap/constants';

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function ProgressRing({ pct, size = 72 }: { pct: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const stroke = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={8} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#grad)" strokeWidth={8} fill="none"
        strokeDasharray={circ} strokeDashoffset={stroke} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const debt = isDocDebt(task);
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all group ${
        task.completed ? 'bg-green-50/60 border-green-100' : debt ? 'bg-amber-50/60 border-amber-100' : 'bg-white border-gray-100 hover:border-gray-200'
      }`}>
      <button onClick={onToggle}
        className={`flex-shrink-0 mt-0.5 transition-all ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}>
        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</span>
          {task.isTechnicalSetup && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Wrench className="w-2.5 h-2.5" />Setup
            </span>
          )}
          {debt && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />Doc Pending
            </span>
          )}
          {task.docDebtResolved && !task.linkedDoc && (
            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
              {task.docDebtNote ? '📝 Note' : task.docDebtAssignee ? `👤 ${task.docDebtAssignee}` : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-400"><User className="w-3 h-3" />{task.owner}</div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
          {task.linkedDoc && (
            <a href={task.linkedDoc} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 hover:underline" onClick={e => e.stopPropagation()}>
              <Link2 className="w-3 h-3" />{task.linkedDoc.replace('https://', '').split('/')[0]}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ContactCard({ contact }: { contact: TeamContact }) {
  const typeColor = contact.contactType === 'onboarding'
    ? 'border-blue-100 bg-blue-50/30'
    : 'border-purple-100 bg-purple-50/20';

  return (
    <div className={`bg-white rounded-2xl border p-4 hover:shadow-sm transition-all ${typeColor}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="text-white font-semibold text-sm">{initials(contact.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.role}</p>
          <span className="inline-block mt-0.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{contact.department}</span>
        </div>
      </div>
      {contact.responsibilities.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {contact.responsibilities.map((r, i) => (
            <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full">{r}</span>
          ))}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {contact.email && (
          <a href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 bg-gray-50 px-2.5 py-1 rounded-lg transition-colors border border-gray-100">
            <Mail className="w-3 h-3" />Email
          </a>
        )}
        {contact.scheduleLink && (
          <a href={contact.scheduleLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors">
            <Calendar className="w-3 h-3" />Schedule 1:1
          </a>
        )}
      </div>
    </div>
  );
}

export default function NewHireView() {
  const navigate = useNavigate();
  const { hireInfo, tasks, launched, contacts, updateTask } = useApp();
  const [showPreview, setShowPreview] = useState(false);

  if (!launched) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <List className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-gray-600">Plan not launched yet</h2>
          <p className="text-gray-400 text-sm mt-1 mb-4">Approve and launch the roadmap to unlock the new hire view.</p>
          <button onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl mx-auto hover:bg-green-700 transition-colors">
            Go to Roadmap <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcoming = tasks.filter(t => {
    if (t.completed) return false;
    const d = new Date(t.dueDate + 'T12:00:00');
    return d >= today && d <= nextWeek;
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdue = tasks.filter(t => {
    if (t.completed) return false;
    return new Date(t.dueDate + 'T12:00:00') < today;
  });

  const onboardingContacts = contacts.filter(c => c.contactType === 'onboarding');
  const collaborators = contacts.filter(c => c.contactType === 'collaborator');

  function toggleTask(id: string) {
    const task = tasks.find(t => t.id === id);
    if (task) updateTask(id, { completed: !task.completed, status: !task.completed ? 'completed' : 'not-started' });
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">New Hire View</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Live</span>
            </div>
            <h1 className="text-gray-900 flex items-center gap-2">
              {hireInfo?.name}'s Onboarding <PartyPopper className="w-5 h-5 text-amber-400" />
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />Preview New Hire View
            </button>
            <button onClick={() => navigate('/roadmap')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Pencil className="w-4 h-4" />Edit Roadmap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <ProgressRing pct={pct} size={72} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-800">{pct}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{completedCount} of {totalCount}</p>
              <p className="text-xs text-gray-500">tasks complete</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{upcoming.length}</p>
              <p className="text-xs font-medium text-gray-600">Due This Week</p>
              <p className="text-xs text-gray-400">{upcoming.length === 0 ? 'All clear!' : `${upcoming[0]?.title.slice(0, 18)}…`}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${overdue.length > 0 ? 'bg-red-50' : 'bg-green-50'} rounded-xl flex items-center justify-center flex-shrink-0`}>
              {overdue.length > 0
                ? <AlertCircle className="w-6 h-6 text-red-600" />
                : <TrendingUp className="w-6 h-6 text-green-600" />}
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{overdue.length > 0 ? overdue.length : tasks.filter(t => t.week === 1 && t.completed).length}</p>
              <p className="text-xs font-medium text-gray-600">{overdue.length > 0 ? 'Overdue' : 'Week 1 Done'}</p>
              <p className="text-xs text-gray-400">{overdue.length > 0 ? 'Needs attention' : `of ${tasks.filter(t => t.week === 1).length} tasks`}</p>
            </div>
          </div>
        </div>

        {/* Overdue */}
        {overdue.length > 0 && (
          <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-red-800">Overdue ({overdue.length})</h3>
            </div>
            <div className="space-y-2">
              {overdue.map(task => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="text-gray-800">Due This Week</h3>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{upcoming.length}</span>
            </div>
            <div className="space-y-2">
              {upcoming.map(task => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
            </div>
          </div>
        )}

        {/* ── Onboarding Team ── */}
        {onboardingContacts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-800">Onboarding Team</h3>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{onboardingContacts.length}</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              These people are responsible for getting {hireInfo?.name?.split(' ')[0]} set up. They're expecting 1:1s — reach out early!
            </p>
            <div className="grid grid-cols-2 gap-3">
              {onboardingContacts.map(c => <ContactCard key={c.id} contact={c} />)}
            </div>
          </div>
        )}

        {/* ── Team Rolodex ── */}
        {collaborators.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-800">Team Network</h3>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">{collaborators.length}</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Cross-functional partners and close collaborators. A great way to ramp up fast is scheduling quick intro calls in week 1–2.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {collaborators.map(c => <ContactCard key={c.id} contact={c} />)}
            </div>
          </div>
        )}

        {/* Full checklist */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flag className="w-4 h-4 text-green-600" />
            <h3 className="text-gray-800">Full Onboarding Checklist</h3>
          </div>
          <div className="space-y-6">
            {getWeeksList(Math.max(1, ...tasks.map(t => t.week))).map(({ week, label, sublabel }) => {
              const weekTasks = tasks.filter(t => t.week === week);
              const doneCount = weekTasks.filter(t => t.completed).length;
              const weekPct = Math.round((doneCount / weekTasks.length) * 100);
              return (
                <div key={week}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{week}</span>
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{label} — {sublabel}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-24">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${weekPct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{doneCount}/{weekTasks.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2 ml-10">
                    {weekTasks.map(task => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {pct === 100 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-center shadow-lg shadow-green-200">
            <PartyPopper className="w-10 h-10 text-white mx-auto mb-3" />
            <h2 className="text-white mb-1">Onboarding Complete! 🎉</h2>
            <p className="text-green-100 text-sm">{hireInfo?.name} has completed all {totalCount} tasks. Excellent work!</p>
          </motion.div>
        )}
      </div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {showPreview && <NewHirePreview onClose={() => setShowPreview(false)} />}
      </AnimatePresence>
    </div>
  );
}
