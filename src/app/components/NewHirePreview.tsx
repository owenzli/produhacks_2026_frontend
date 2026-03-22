import { useState } from 'react';
import {
  X, Eye, CheckCircle2, Circle, Calendar, User, Link2,
  Mail, Wrench, AlertCircle, ChevronDown, ChevronUp,
  Sparkles, Clock, PartyPopper, ExternalLink, Network, UserCheck
} from 'lucide-react';
import { useApp, Task, Week, TeamContact, isDocDebt } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

const WEEKS: { week: Week; label: string; emoji: string }[] = [
  { week: 1, label: 'Week 1 — Foundation & Setup', emoji: '🚀' },
  { week: 2, label: 'Week 2 — Ramp Up', emoji: '📈' },
  { week: 3, label: 'Week 3 — Contribution', emoji: '🛠️' },
  { week: 4, label: 'Week 4+ — Independence', emoji: '🎯' },
];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function PreviewTaskItem({ task }: { task: Task }) {
  const debt = isDocDebt(task);
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      task.completed ? 'bg-green-50/80 border-green-100' : debt ? 'bg-amber-50/60 border-amber-100' : 'bg-white border-gray-100'
    }`}>
      <div className={`flex-shrink-0 mt-0.5 ${task.completed ? 'text-green-500' : 'text-gray-200'}`}>
        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </span>
          {task.isTechnicalSetup && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <Wrench className="w-2.5 h-2.5" />Setup
            </span>
          )}
          {debt && (
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />Doc Coming Soon
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <User className="w-3 h-3" />{task.owner}
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
          {task.linkedDoc && (
            <a href={task.linkedDoc} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs text-green-600 hover:underline" onClick={e => e.stopPropagation()}>
              <Link2 className="w-3 h-3" />Open Doc <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: TeamContact }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-green-200 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="text-white font-semibold text-sm">{initials(contact.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
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
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 bg-gray-50 px-2.5 py-1 rounded-lg transition-colors border border-gray-100 hover:border-green-200">
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

interface PreviewModalProps {
  onClose: () => void;
}

export default function NewHirePreview({ onClose }: PreviewModalProps) {
  const { hireInfo, tasks, contacts } = useApp();
  const [expandedWeeks, setExpandedWeeks] = useState<Set<Week>>(new Set([1]));

  function toggleWeek(week: Week) {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const onboardingContacts = contacts.filter(c => c.contactType === 'onboarding');
  const collaborators = contacts.filter(c => c.contactType === 'collaborator');

  const startDateFormatted = hireInfo?.startDate
    ? new Date(hireInfo.startDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Your start date';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col"
        onClick={onClose}
      >
        {/* Preview banner */}
        <div className="flex-shrink-0 bg-gray-900 text-white flex items-center justify-between px-6 py-2.5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-lg px-3 py-1">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Manager Preview Mode</span>
            </div>
            <span className="text-gray-400 text-sm">Viewing as: <span className="text-white font-medium">{hireInfo?.name ?? 'New Hire'}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">This is exactly what your new hire will see when the plan is launched</span>
            <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
              <X className="w-4 h-4" /> Exit Preview
            </button>
          </div>
        </div>

        {/* New hire "portal" */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-green-50/30"
          onClick={e => e.stopPropagation()}
        >
          {/* Portal header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-5 h-5 text-green-200" />
                <span className="text-green-200 text-sm">Welcome to the team!</span>
              </div>
              <h1 className="text-white text-3xl mb-1">Hey {hireInfo?.name?.split(' ')[0] ?? 'there'} 👋</h1>
              <p className="text-green-100">
                You're joining as <span className="font-semibold text-white">{hireInfo?.roleTitle ?? 'a new team member'}</span> on {startDateFormatted}.
                Here's everything you need for your first 30 days.
              </p>

              <div className="flex gap-4 mt-5">
                <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <p className="text-green-100 text-xs mb-0.5">Department</p>
                  <p className="text-white font-medium">{hireInfo?.department}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <p className="text-green-100 text-xs mb-0.5">Work Mode</p>
                  <p className="text-white font-medium capitalize">{hireInfo?.workMode}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <p className="text-green-100 text-xs mb-0.5">Progress</p>
                  <p className="text-white font-medium">{completedCount} / {totalCount} tasks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
            {/* Progress bar */}
            {pct > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">Your onboarding progress</span>
                    <span className="text-sm font-semibold text-green-700">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>
                {pct === 100 && <PartyPopper className="w-6 h-6 text-amber-400 flex-shrink-0" />}
              </div>
            )}

            {/* Your onboarding team */}
            {onboardingContacts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-gray-900">Your Onboarding Team</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  These people are here to help you get set up. Reach out to schedule a 1:1 or ask questions — they're expecting to hear from you!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {onboardingContacts.map(c => <ContactCard key={c.id} contact={c} />)}
                </div>
              </div>
            )}

            {/* Team rolodex */}
            {collaborators.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-5 h-5 text-purple-600" />
                  <h2 className="text-gray-900">Your Team Network</h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  Cross-functional partners you'll work closely with. A great way to start is booking a quick intro call!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {collaborators.map(c => <ContactCard key={c.id} contact={c} />)}
                </div>
              </div>
            )}

            {/* Week-by-week checklist */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">Your 30-Day Roadmap</h2>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Your personalized checklist to guide you through the first month. Check items off as you complete them!
              </p>

              <div className="space-y-3">
                {WEEKS.map(({ week, label, emoji }) => {
                  const weekTasks = tasks.filter(t => t.week === week);
                  if (weekTasks.length === 0) return null;
                  const doneCount = weekTasks.filter(t => t.completed).length;
                  const weekPct = Math.round((doneCount / weekTasks.length) * 100);
                  const expanded = expandedWeeks.has(week);

                  return (
                    <div key={week} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleWeek(week)}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
                      >
                        <span className="text-2xl">{emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{label}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                                style={{ width: `${weekPct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400">{doneCount}/{weekTasks.length} done</span>
                          </div>
                        </div>
                        {weekPct === 100 && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-5 pb-4 space-y-2 border-t border-gray-50">
                              <div className="pt-3" />
                              {weekTasks.map(task => <PreviewTaskItem key={task.id} task={task} />)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer note */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
              <p className="text-green-800 font-medium mb-1">Questions? Your manager is here to help 🙌</p>
              <p className="text-green-600 text-sm">Don't hesitate to reach out at any point during your first 30 days.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
