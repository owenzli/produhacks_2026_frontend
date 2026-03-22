import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Flag, ArrowRight, Eye, Rocket, Users, AlertTriangle, CheckCircle2, Filter, ArrowUpDown, X } from 'lucide-react';
import { useApp, Task, Week, isDocDebt } from '../context/AppContext';
import TeamSetup from './TeamSetup';
import NewHirePreview from './NewHirePreview';
import { FILTER_OPTIONS, SORT_OPTIONS, STATUS_SORT_ORDER, getWeeksList, FilterKey, SortKey } from './roadmap/constants';
import { FilterBar } from './roadmap/FilterBar';
import { AddTaskModal } from './roadmap/AddTaskModal';
import { TaskRow } from './roadmap/TaskRow';
import { WeekSection, ColumnHeaders } from './roadmap/WeekSection';

type Tab = 'tasks' | 'team';

export default function RoadmapReview() {
  const navigate = useNavigate();
  const { hireInfo, tasks, addTask, contacts, setLaunched, roadmapGenerated } = useApp();
  const [searchParams] = useSearchParams();
  const [tab, setTab]                 = useState<Tab>(() => searchParams.get('tab') === 'team' ? 'team' : 'tasks');
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [sortBy, setSortBy]           = useState<SortKey>('week');
  const [addTaskWeek, setAddTaskWeek] = useState<Week | null>(null);

  if (!roadmapGenerated) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="empty-state">
          <p className="empty-state-tag">launchpath / roadmap</p>
          <div className="empty-state-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="19" cy="5" r="2"/>
              <circle cx="19" cy="19" r="2"/>
              <path d="M7 12h5l3-5" strokeDasharray="3 2"/>
              <path d="M12 12l4 5" strokeDasharray="3 2"/>
            </svg>
          </div>
          <p className="empty-state-title">No roadmap generated yet</p>
          <p className="empty-state-body">Run the Onboarding Wizard to generate a week-by-week plan for your hire.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-6">
            Open Wizard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const today         = new Date().toISOString().split('T')[0];
  const docDebtCount  = tasks.filter(t => isDocDebt(t)).length;
  const contactCount  = contacts.length;

  const filterOpt = FILTER_OPTIONS.find(f => f.key === activeFilter)!;

  const filteredTasks = useMemo(
    () => tasks.filter(t => filterOpt.predicate(t, today)),
    [tasks, activeFilter, today, filterOpt]
  );

  const sortedFilteredTasks = useMemo(() => {
    if (sortBy === 'week') return filteredTasks;
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === 'due-date') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status];
    });
  }, [filteredTasks, sortBy]);

  function handleLaunch() {
    setLaunched(true);
    setShowLaunchModal(false);
    navigate('/new-hire');
  }

  const isFiltering = activeFilter !== 'all';
  const matchCount  = filteredTasks.length;

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20">
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <p className="font-mono-label text-gray-400 mb-1">launchpath / roadmap</p>
              <h1 className="text-gray-900 leading-none">{hireInfo?.name}</h1>
              <p className="text-sm text-gray-400 font-mono mt-1">{hireInfo?.roleTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-all">
                <Eye className="w-4 h-4" />Preview New Hire View
              </button>
              <button onClick={() => setShowLaunchModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-5 py-2.5 rounded-sm transition-all shadow-md shadow-gray-200">
                <Rocket className="w-4 h-4" />Approve & Launch
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button onClick={() => setTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                tab === 'tasks' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}>
              <Flag className="w-4 h-4" />Tasks
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${tab === 'tasks' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {tasks.length}
              </span>
            </button>
            <button onClick={() => setTab('team')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                tab === 'team' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}>
              <Users className="w-4 h-4" />Team & Contacts
              <span className={`text-xs px-1.5 py-0.5 rounded-sm ${tab === 'team' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {contactCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Tasks Tab ── */}
        {tab === 'tasks' && (
          <div className="space-y-4">
            {/* Hire info bar */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-sm border border-gray-200 px-5 py-4 flex items-center gap-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {hireInfo?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex gap-6 flex-wrap">
                {[
                  { label: 'Department', value: hireInfo?.department },
                  { label: 'Start Date',  value: hireInfo?.startDate ? new Date(hireInfo.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                  { label: 'Work Mode',  value: hireInfo?.workMode },
                  { label: 'Total Tasks', value: tasks.length.toString() },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-900">{item.label}</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Doc debt banner */}
            {docDebtCount > 0 ? (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-sm px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-900">{docDebtCount} Doc Debt {docDebtCount === 1 ? 'Item' : 'Items'} — Resolve before launching</p>
                  <p className="text-sm text-amber-700 mt-0.5">Click the amber "Doc Debt" badge on any task to resolve it quickly.</p>
                </div>
                <button onClick={() => setActiveFilter('doc-debt')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-3 py-1.5 rounded-sm flex-shrink-0 transition-colors">
                  {docDebtCount} remaining
                </button>
              </motion.div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-sm px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-gray-900" />
                </div>
                <p className="font-medium text-green-900">All documentation linked — roadmap is ready to launch!</p>
              </div>
            )}

            {/* Filter bar */}
            <FilterBar
              tasks={tasks}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Active filter result summary */}
            <AnimatePresence>
              {isFiltering && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2 px-1">
                  {(() => {
                    const opt = FILTER_OPTIONS.find(f => f.key === activeFilter)!;
                    const Icon = opt.icon;
                    return (
                      <>
                        <Icon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Showing <span className="font-semibold text-gray-800">{matchCount}</span> {matchCount === 1 ? 'task' : 'tasks'} matching <span className="font-semibold text-gray-800">{opt.label}</span>
                        </span>
                        <button onClick={() => setActiveFilter('all')}
                          className="ml-1 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-3 h-3" /> Clear
                        </button>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Week sections or flat sorted list */}
            {sortBy === 'week' ? (
              getWeeksList(Math.max(1, ...tasks.map(t => t.week))).map(({ week, label, sublabel }) => {
                const weekTasks = filteredTasks.filter(t => t.week === week);
                if (weekTasks.length === 0) return null;
                return (
                  <WeekSection key={week} week={week} label={label} sublabel={sublabel}
                    tasks={weekTasks} onAddTask={w => setAddTaskWeek(w)} />
                );
              })
            ) : (
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50/80 border-b border-gray-100">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Sorted by {SORT_OPTIONS.find(s => s.key === sortBy)?.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">{sortedFilteredTasks.length} tasks</span>
                </div>
                <ColumnHeaders />
                {sortedFilteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Filter className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">No tasks match this filter</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50/80">
                    {sortedFilteredTasks.map(task => <TaskRow key={task.id} task={task} />)}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {filteredTasks.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-14 h-14 bg-gray-100 rounded-sm flex items-center justify-center mb-3">
                  <Filter className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm font-medium text-gray-500">No tasks match this filter</p>
                <button onClick={() => setActiveFilter('all')}
                  className="mt-3 text-xs text-gray-900 hover:text-gray-900 font-medium">
                  Clear filter
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* ── Team Tab ── */}
        {tab === 'team' && <TeamSetup />}
      </div>

      {/* ── Launch Modal ── */}
      <AnimatePresence>
        {showLaunchModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLaunchModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-sm shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-gray-900 rounded-sm flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900">Approve & Launch Plan</h2>
                  <p className="text-gray-500 text-sm">Send the plan to {hireInfo?.name}</p>
                </div>
              </div>

              {docDebtCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>{docDebtCount} unresolved Doc Debt</strong> items detected. Consider resolving these before launching.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-sm p-4 mb-5 space-y-2">
                {[
                  { label: 'New Hire',      value: hireInfo?.name },
                  { label: 'Total Tasks',   value: tasks.length.toString() },
                  { label: 'Week 1 Tasks',  value: tasks.filter(t => t.week === 1).length.toString() },
                  { label: 'Team Contacts', value: contacts.length.toString() },
                  { label: 'Doc Debt Items',value: docDebtCount.toString(), highlight: docDebtCount > 0 },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className={`font-medium ${row.highlight ? 'text-amber-600' : 'text-gray-800'}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowLaunchModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleLaunch}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-2.5 rounded-sm transition-all shadow-md shadow-gray-200">
                  <Rocket className="w-4 h-4" />Launch Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {showPreview && <NewHirePreview onClose={() => setShowPreview(false)} />}
      </AnimatePresence>

      {/* ── Add Task Modal ── */}
      <AnimatePresence>
        {addTaskWeek !== null && (
          <AddTaskModal
            defaultWeek={addTaskWeek}
            onAdd={task => { addTask(task); setAddTaskWeek(null); }}
            onClose={() => setAddTaskWeek(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
