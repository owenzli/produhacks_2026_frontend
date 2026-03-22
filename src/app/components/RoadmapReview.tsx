import { useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  AlertTriangle, CheckCircle2, Plus, Trash2, Wrench,
  Rocket, ChevronDown, ChevronUp, X, Link2, FileText, UserCheck,
  Edit3, Save, Flag, ArrowRight, Eye, Users, SlidersHorizontal,
  ZapIcon, CalendarClock, Filter, ArrowUpDown,
  CircleDot, CheckCircle, ExternalLink, Calendar,
} from 'lucide-react';
import { useApp, Task, TaskStatus, Week, isDocDebt } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import TeamSetup from './TeamSetup';
import NewHirePreview from './NewHirePreview';

// ─── Constants ────────────────────────────────────────────────────────────────
const WEEKS: { week: Week; label: string; sublabel: string }[] = [
  { week: 1, label: 'Week 1', sublabel: 'Foundation & Setup' },
  { week: 2, label: 'Week 2', sublabel: 'Ramp Up' },
  { week: 3, label: 'Week 3', sublabel: 'Contribution' },
  { week: 4, label: 'Week 4+', sublabel: 'Independence' },
];

const POC_LIST = ['Manager', 'Tech Lead', 'DevOps', 'IT Team', 'QA Lead', 'Design Lead', 'Security Team', 'HR', 'Director', 'DevOps Lead', 'Self'];

const STATUS_CONFIG: Record<TaskStatus, { label: string; classes: string; dot: string }> = {
  'not-started': { label: 'Not Started', classes: 'bg-gray-100 text-gray-600',  dot: 'bg-gray-400'  },
  'in-progress':  { label: 'In Progress',  classes: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-500'  },
  'completed':    { label: 'Completed',    classes: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const STATUS_CYCLE: TaskStatus[] = ['not-started', 'in-progress', 'completed'];

// ─── Doc icon helper ──────────────────────────────────────────────────────────
interface DocMeta { label: string; bg: string; text: string; abbr: string }

function getDocMeta(url: string): DocMeta {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    if (host.includes('notion.so'))      return { label: 'Notion',      bg: 'bg-gray-900',    text: 'text-white', abbr: 'N'  };
    if (host.includes('github.com'))     return { label: 'GitHub',      bg: 'bg-gray-800',    text: 'text-white', abbr: 'GH' };
    if (host.includes('gitlab.com'))     return { label: 'GitLab',      bg: 'bg-orange-600',  text: 'text-white', abbr: 'GL' };
    if (host.includes('figma.com'))      return { label: 'Figma',       bg: 'bg-purple-600',  text: 'text-white', abbr: 'Fg' };
    if (host.includes('atlassian.net'))  return { label: 'Jira',        bg: 'bg-blue-600',    text: 'text-white', abbr: 'J'  };
    if (host.includes('confluence'))     return { label: 'Confluence',  bg: 'bg-blue-500',    text: 'text-white', abbr: 'C'  };
    if (host.includes('docs.google') || (host.includes('google') && url.includes('/docs')))
                                         return { label: 'Google Docs', bg: 'bg-blue-500',    text: 'text-white', abbr: 'GD' };
    if (host.includes('looker'))         return { label: 'Looker',      bg: 'bg-orange-500',  text: 'text-white', abbr: 'Lo' };
    if (host.includes('datadoghq'))      return { label: 'Datadog',     bg: 'bg-purple-700',  text: 'text-white', abbr: 'DD' };
    if (host.includes('dovetail'))       return { label: 'Dovetail',    bg: 'bg-pink-600',    text: 'text-white', abbr: 'Dv' };
    if (host.includes('owasp'))          return { label: 'OWASP',       bg: 'bg-red-600',     text: 'text-white', abbr: 'OW' };
    if (host.includes('storybook'))      return { label: 'Storybook',   bg: 'bg-pink-500',    text: 'text-white', abbr: 'SB' };
    if (host.includes('mlflow'))         return { label: 'MLflow',      bg: 'bg-orange-400',  text: 'text-white', abbr: 'ML' };
    if (host.includes('wiki'))           return { label: 'Wiki',        bg: 'bg-gray-500',    text: 'text-white', abbr: 'W'  };
    // Generic fallback
    const name = host.split('.')[0];
    return { label: name, bg: 'bg-gray-500', text: 'text-white', abbr: name.slice(0, 2).toUpperCase() };
  } catch {
    return { label: 'Link', bg: 'bg-gray-400', text: 'text-white', abbr: '??' };
  }
}

function DocBadge({ url }: { url: string }) {
  const m = getDocMeta(url);
  return (
    <span
      title={m.label}
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold flex-shrink-0 ${m.bg} ${m.text}`}
    >
      {m.abbr}
    </span>
  );
}

// ─── Filter types ─────────────────────────────────────────────────────────────
type FilterKey = 'all' | 'tech-setup' | 'doc-debt' | 'overdue' | 'completable' | 'in-progress' | 'completed';
type SortKey   = 'week' | 'due-date' | 'status';

interface FilterOption {
  key: FilterKey;
  label: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
  count: (tasks: Task[]) => number;
  predicate: (task: Task, today: string) => boolean;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    key: 'all',
    label: 'All Tasks',
    icon: SlidersHorizontal,
    color: 'border-gray-200 text-gray-600 hover:bg-gray-50',
    activeColor: 'bg-gray-800 border-gray-800 text-white',
    count: tasks => tasks.length,
    predicate: () => true,
  },
  {
    key: 'tech-setup',
    label: 'Tech Setup',
    icon: Wrench,
    color: 'border-blue-200 text-blue-600 hover:bg-blue-50',
    activeColor: 'bg-blue-600 border-blue-600 text-white',
    count: tasks => tasks.filter(t => t.isTechnicalSetup).length,
    predicate: t => t.isTechnicalSetup,
  },
  {
    key: 'doc-debt',
    label: 'Doc Debt',
    icon: AlertTriangle,
    color: 'border-amber-200 text-amber-600 hover:bg-amber-50',
    activeColor: 'bg-amber-500 border-amber-500 text-white',
    count: tasks => tasks.filter(t => isDocDebt(t)).length,
    predicate: t => isDocDebt(t),
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: CalendarClock,
    color: 'border-red-200 text-red-500 hover:bg-red-50',
    activeColor: 'bg-red-500 border-red-500 text-white',
    count: tasks => {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'completed').length;
    },
    predicate: (t, today) => !!t.dueDate && t.dueDate < today && t.status !== 'completed',
  },
  {
    key: 'completable',
    label: 'Completable Now',
    icon: ZapIcon,
    color: 'border-green-200 text-green-600 hover:bg-green-50',
    activeColor: 'bg-green-600 border-green-600 text-white',
    count: tasks => tasks.filter(t => t.status === 'not-started' && !isDocDebt(t)).length,
    predicate: t => t.status === 'not-started' && !isDocDebt(t),
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    icon: CircleDot,
    color: 'border-indigo-200 text-indigo-600 hover:bg-indigo-50',
    activeColor: 'bg-indigo-600 border-indigo-600 text-white',
    count: tasks => tasks.filter(t => t.status === 'in-progress').length,
    predicate: t => t.status === 'in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    color: 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
    activeColor: 'bg-emerald-600 border-emerald-600 text-white',
    count: tasks => tasks.filter(t => t.status === 'completed').length,
    predicate: t => t.status === 'completed',
  },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'week',     label: 'Week'     },
  { key: 'due-date', label: 'Due Date' },
  { key: 'status',   label: 'Status'   },
];

const STATUS_SORT_ORDER: Record<TaskStatus, number> = { 'in-progress': 0, 'not-started': 1, 'completed': 2 };

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({
  tasks, activeFilter, setActiveFilter, sortBy, setSortBy,
}: {
  tasks: Task[];
  activeFilter: FilterKey;
  setActiveFilter: (k: FilterKey) => void;
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Filter</span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {FILTER_OPTIONS.map(opt => {
            const count = opt.count(tasks);
            const active = activeFilter === opt.key;
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                disabled={count === 0 && opt.key !== 'all'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex-shrink-0 ${
                  active ? opt.activeColor : opt.color
                } ${count === 0 && opt.key !== 'all' ? 'opacity-40 cursor-default' : ''}`}
              >
                <Icon className="w-3 h-3" />
                {opt.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${active ? 'bg-white/20' : 'bg-black/[0.07]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0 border-l border-gray-100 pl-4">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Sort</span>
          <div className="flex gap-1.5">
            {SORT_OPTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === s.key ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Doc Debt Panel ───────────────────────────────────────────────────────────
function DocDebtPanel({ task, onUpdate, onClose }: {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'link' | 'note' | 'assign' | null>(null);
  const [value, setValue] = useState('');

  function resolve() {
    if (mode === 'link')   onUpdate({ linkedDoc: value, docDebtResolved: true });
    if (mode === 'note')   onUpdate({ docDebtNote: value, docDebtResolved: true });
    if (mode === 'assign') onUpdate({ docDebtAssignee: value, docDebtResolved: true });
    onClose();
  }

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2 mx-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">Resolve Doc Debt</p>
          </div>
          <button onClick={onClose} className="text-amber-400 hover:text-amber-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-2 mb-3">
          {([
            { id: 'link'   as const, icon: Link2,     label: 'Link a Doc'    },
            { id: 'note'   as const, icon: FileText,   label: 'Write a Note'  },
            { id: 'assign' as const, icon: UserCheck,  label: 'Assign Owner'  },
          ]).map(opt => (
            <button key={opt.id} onClick={() => { setMode(opt.id); setValue(''); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                mode === opt.id ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}>
              <opt.icon className="w-3.5 h-3.5" />{opt.label}
            </button>
          ))}
        </div>
        {mode && (
          <div className="flex gap-2">
            {mode === 'assign' ? (
              <select value={value} onChange={e => setValue(e.target.value)}
                className="flex-1 border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300">
                <option value="">Select person…</option>
                {POC_LIST.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type="text" value={value} onChange={e => setValue(e.target.value)}
                placeholder={mode === 'link' ? 'https://notion.so/your-doc' : 'Brief explanation…'}
                className="flex-1 border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300" />
            )}
            <button onClick={resolve} disabled={!value}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────
function AddTaskModal({ defaultWeek, onAdd, onClose }: {
  defaultWeek: Week;
  onAdd: (task: Task) => void;
  onClose: () => void;
}) {
  const [title, setTitle]     = useState('');
  const [poc, setPoc]         = useState('Manager');
  const [week, setWeek]       = useState<Week>(defaultWeek);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isTech, setIsTech]   = useState(false);

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({
      id: Math.random().toString(36).substring(2, 10),
      title: title.trim(),
      owner: poc,
      dueDate,
      linkedDoc: '',
      status: 'not-started',
      week,
      docDebtResolved: false,
      docDebtNote: '',
      docDebtAssignee: '',
      isTechnicalSetup: isTech,
      completed: false,
      category: 'Custom',
    });
    onClose();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Add Custom Task</h2>
            <p className="text-gray-400 text-sm">Fill in the task details below</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Task Title <span className="text-red-400">*</span></label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') onClose(); }}
              placeholder="e.g. Complete security training module"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all"
            />
          </div>

          {/* POC + Week row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Point of Contact</label>
              <select value={poc} onChange={e => setPoc(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300">
                {POC_LIST.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Week</label>
              <select value={week} onChange={e => setWeek(Number(e.target.value) as Week)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300">
                <option value={1}>Week 1 — Foundation</option>
                <option value={2}>Week 2 — Ramp Up</option>
                <option value={3}>Week 3 — Contribution</option>
                <option value={4}>Week 4+ — Independence</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300" />
            </div>
          </div>

          {/* Tech setup toggle */}
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60 cursor-pointer hover:bg-blue-50/40 hover:border-blue-100 transition-all">
            <input type="checkbox" checked={isTech} onChange={e => setIsTech(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200" />
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm text-gray-700">Mark as Technical Setup task</span>
            </div>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
          <button onClick={handleAdd} disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />Add Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────
function TaskRow({ task }: { task: Task }) {
  const { updateTask, removeTask } = useApp();
  const [editingTitle, setEditingTitle]   = useState(false);
  const [titleDraft,   setTitleDraft]     = useState(task.title);
  const [showDebtPanel, setShowDebtPanel] = useState(false);

  const debt      = isDocDebt(task);
  const today     = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'completed';

  function saveTitle() {
    updateTask(task.id, { title: titleDraft });
    setEditingTitle(false);
  }

  const statusCfg = STATUS_CONFIG[task.status];

  return (
    <div className={`group ${debt ? 'bg-amber-50/60' : 'hover:bg-gray-50/60'} transition-colors`}>
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${debt ? 'border-amber-100' : 'border-gray-50'}`}>

        {/* Tech-setup dot indicator */}
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 self-start ${task.isTechnicalSetup ? 'bg-blue-400' : 'bg-gray-200'}`} />

        {/* Title + badges */}
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input autoFocus value={titleDraft} onChange={e => setTitleDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
                className="flex-1 border border-green-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
              <button onClick={saveTitle} className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                <Save className="w-3.5 h-3.5 text-green-700" />
              </button>
              <button onClick={() => setEditingTitle(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-800 truncate">{task.title}</span>
              <button onClick={() => { setEditingTitle(true); setTitleDraft(task.title); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all flex-shrink-0">
                <Edit3 className="w-3 h-3 text-gray-400" />
              </button>
              {/* Tags — uniform height via h-5 */}
              {task.isTechnicalSetup && (
                <span className="inline-flex items-center gap-1 h-5 text-xs bg-blue-100 text-blue-700 px-2 rounded-full flex-shrink-0">
                  <Wrench className="w-2.5 h-2.5" />Setup
                </span>
              )}
              {debt && !task.docDebtResolved && (
                <button onClick={() => setShowDebtPanel(v => !v)}
                  className="inline-flex items-center gap-1 h-5 text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 rounded-full flex-shrink-0 hover:bg-amber-200 transition-colors">
                  <AlertTriangle className="w-2.5 h-2.5" />Doc Debt
                </button>
              )}
              {task.docDebtResolved && (
                <span className="inline-flex items-center gap-1 h-5 text-xs bg-green-100 text-green-700 px-2 rounded-full flex-shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5" />Resolved
                </span>
              )}
            </div>
          )}
        </div>

        {/* Point of Contact */}
        <select value={task.owner} onChange={e => updateTask(task.id, { owner: e.target.value })}
          className="text-xs text-gray-600 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 px-2 py-1.5 hover:border-gray-300 transition-colors cursor-pointer w-34 flex-shrink-0">
          {POC_LIST.map(o => <option key={o}>{o}</option>)}
        </select>

        {/* Due date */}
        <div className="relative flex-shrink-0">
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          <input type="date" value={task.dueDate} onChange={e => updateTask(task.id, { dueDate: e.target.value })}
            className={`text-xs border rounded-lg pl-6 pr-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 cursor-pointer transition-colors w-32 ${
              isOverdue ? 'border-red-200 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`} />
        </div>

        {/* Linked doc */}
        <div className="w-36 flex items-center gap-1 flex-shrink-0">
          {task.linkedDoc ? (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-2 py-1.5 flex-1 min-w-0">
              <DocBadge url={task.linkedDoc} />
              <a href={task.linkedDoc} target="_blank" rel="noreferrer"
                className="text-xs text-green-700 truncate hover:underline flex items-center gap-1 flex-1 min-w-0"
                onClick={e => e.stopPropagation()}>
                <span className="truncate">{getDocMeta(task.linkedDoc).label}</span>
                <ExternalLink className="w-2.5 h-2.5 flex-shrink-0 opacity-60" />
              </a>
              <button onClick={() => updateTask(task.id, { linkedDoc: '', docDebtResolved: false })} className="text-green-400 hover:text-green-600 flex-shrink-0">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => {
              const url = prompt('Enter documentation URL:');
              if (url) updateTask(task.id, { linkedDoc: url, docDebtResolved: true });
            }} className="text-xs text-gray-400 hover:text-green-600 border border-dashed border-gray-200 hover:border-green-300 rounded-lg px-2 py-1.5 flex items-center gap-1 flex-1 transition-all">
              <Plus className="w-3 h-3" />Add link
            </button>
          )}
        </div>

        {/* Status — dropdown */}
        <div className="flex-shrink-0 w-28">
          <select
            value={task.status}
            onChange={e => updateTask(task.id, { status: e.target.value as TaskStatus })}
            className={`w-full text-xs px-2.5 py-1.5 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-200 transition-all ${statusCfg.classes}`}
          >
            {STATUS_CYCLE.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>

        {/* Delete */}
        <button onClick={() => removeTask(task.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all text-gray-300 hover:text-red-400 flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {showDebtPanel && (
          <DocDebtPanel task={task} onUpdate={u => updateTask(task.id, u)} onClose={() => setShowDebtPanel(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Column header row ────────────────────────────────────────────────────────
function ColumnHeaders() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/80 border-t border-gray-100 border-b">
      <div className="w-1.5 flex-shrink-0" />
      <div className="flex-1 text-xs text-gray-400 font-medium">Task</div>
      <div className="w-34 text-xs text-gray-400 font-medium flex-shrink-0">Point of Contact</div>
      <div className="w-32 text-xs text-gray-400 font-medium flex-shrink-0">Due Date</div>
      <div className="w-36 text-xs text-gray-400 font-medium flex-shrink-0">Linked Doc</div>
      <div className="w-28 text-xs text-gray-400 font-medium flex-shrink-0">Status</div>
      <div className="w-8 flex-shrink-0" />
    </div>
  );
}

// ─── Week Section ─────────────────────────────────────────────────────────────
function WeekSection({
  week, label, sublabel, tasks, onAddTask,
}: {
  week: Week; label: string; sublabel: string; tasks: Task[];
  onAddTask: (w: Week) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const debtCount = tasks.filter(t => isDocDebt(t)).length;
  const techCount = tasks.filter(t => t.isTechnicalSetup).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50/60 transition-colors text-left">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{week}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{label}</span>
            <span className="text-gray-400 text-sm">—</span>
            <span className="text-gray-500 text-sm">{sublabel}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">{tasks.length} tasks</span>
            {techCount > 0 && <span className="text-xs text-blue-500 flex items-center gap-1"><Wrench className="w-3 h-3" />{techCount} tech setup</span>}
            {debtCount > 0 && <span className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{debtCount} doc debt</span>}
          </div>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <ColumnHeaders />
            <div className="divide-y divide-gray-50/80">
              {tasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
            <div className="px-4 py-3 border-t border-gray-50">
              <button onClick={() => onAddTask(week)}
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />Add custom task
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flag className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-gray-600">No roadmap yet</h2>
          <p className="text-gray-400 text-sm mt-1 mb-4">Complete the Onboarding Wizard first to generate a plan.</p>
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl mx-auto hover:bg-green-700 transition-colors">
            Go to Wizard <ArrowRight className="w-4 h-4" />
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
    [tasks, activeFilter, today]
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
    <div className="min-h-full bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Roadmap Review</span>
              <h1 className="text-gray-900 flex items-center gap-2">
                {hireInfo?.name}
                <span className="text-gray-400 text-lg">·</span>
                <span className="text-gray-500 font-normal">{hireInfo?.roleTitle}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-all">
                <Eye className="w-4 h-4" />Preview New Hire View
              </button>
              <button onClick={() => setShowLaunchModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-green-200">
                <Rocket className="w-4 h-4" />Approve & Launch
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button onClick={() => setTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === 'tasks' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}>
              <Flag className="w-4 h-4" />Tasks
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'tasks' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {tasks.length}
              </span>
            </button>
            <button onClick={() => setTab('team')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === 'team' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}>
              <Users className="w-4 h-4" />Team & Contacts
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'team' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {contactCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* ── Tasks Tab ── */}
        {tab === 'tasks' && (
          <div className="space-y-4">
            {/* Hire info bar */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 px-5 py-4 flex items-center gap-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    <p className="text-xs text-green-600">{item.label}</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Doc debt banner */}
            {docDebtCount > 0 ? (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-amber-900">{docDebtCount} Doc Debt {docDebtCount === 1 ? 'Item' : 'Items'} — Resolve before launching</p>
                  <p className="text-sm text-amber-700 mt-0.5">Click the amber "Doc Debt" badge on any task to resolve it quickly.</p>
                </div>
                <button onClick={() => setActiveFilter('doc-debt')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors">
                  {docDebtCount} remaining
                </button>
              </motion.div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
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
              WEEKS.map(({ week, label, sublabel }) => {
                const weekTasks = filteredTasks.filter(t => t.week === week);
                if (weekTasks.length === 0) return null;
                return (
                  <WeekSection key={week} week={week} label={label} sublabel={sublabel}
                    tasks={weekTasks} onAddTask={w => setAddTaskWeek(w)} />
                );
              })
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <Filter className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm font-medium text-gray-500">No tasks match this filter</p>
                <button onClick={() => setActiveFilter('all')}
                  className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium">
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
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900">Approve & Launch Plan</h2>
                  <p className="text-gray-500 text-sm">Send the plan to {hireInfo?.name}</p>
                </div>
              </div>

              {docDebtCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>{docDebtCount} unresolved Doc Debt</strong> items detected. Consider resolving these before launching.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
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
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleLaunch}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-green-200">
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
