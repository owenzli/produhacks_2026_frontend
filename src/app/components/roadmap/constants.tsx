import { SlidersHorizontal, Wrench, AlertTriangle, CalendarClock, ZapIcon, CircleDot, CheckCircle } from 'lucide-react';
import { Task, TaskStatus, Week, isDocDebt } from '../../context/AppContext';

export function getWeeksList(maxWeek: number): { week: number; label: string; sublabel: string }[] {
  const list = [];
  for (let w = 1; w <= maxWeek; w++) {
    let sublabel = '';
    if (w === 1) sublabel = 'Foundation & Setup';
    else if (w === 2) sublabel = 'Ramp Up';
    else if (w === 3) sublabel = 'Contribution';
    else if (w === maxWeek) sublabel = 'Independence';
    else sublabel = 'Growth & Integration';
    list.push({ week: w, label: `Week ${w}`, sublabel });
  }
  return list;
}

export const POC_LIST = ['Manager', 'Tech Lead', 'DevOps', 'IT Team', 'QA Lead', 'Design Lead', 'Security Team', 'HR', 'Director', 'DevOps Lead', 'Self'];

export const STATUS_CONFIG: Record<TaskStatus, { label: string; classes: string; dot: string }> = {
  'not-started': { label: 'Not Started', classes: 'bg-gray-100 text-gray-600',  dot: 'bg-gray-400'  },
  'in-progress':  { label: 'In Progress',  classes: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-500'  },
  'completed':    { label: 'Completed',    classes: 'bg-gray-100 text-gray-900', dot: 'bg-gray-800' },
};

export const STATUS_CYCLE: TaskStatus[] = ['not-started', 'in-progress', 'completed'];

export type FilterKey = 'all' | 'tech-setup' | 'doc-debt' | 'overdue' | 'completable' | 'in-progress' | 'completed';
export type SortKey   = 'week' | 'due-date' | 'status';

export interface FilterOption {
  key: FilterKey;
  label: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
  count: (tasks: Task[]) => number;
  predicate: (task: Task, today: string) => boolean;
}

export const FILTER_OPTIONS: FilterOption[] = [
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
    color: 'border-gray-200 text-gray-900 hover:bg-gray-50',
    activeColor: 'bg-gray-900 border-gray-900 text-white',
    count: tasks => tasks.filter(t => t.status === 'not-started' && !isDocDebt(t)).length,
    predicate: t => t.status === 'not-started' && !isDocDebt(t),
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    icon: CircleDot,
    color: 'border-gray-200 text-gray-900 hover:bg-gray-50',
    activeColor: 'bg-gray-900 border-indigo-600 text-white',
    count: tasks => tasks.filter(t => t.status === 'in-progress').length,
    predicate: t => t.status === 'in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    color: 'border-gray-200 text-gray-800 hover:bg-gray-50',
    activeColor: 'bg-emerald-600 border-emerald-600 text-white',
    count: tasks => tasks.filter(t => t.status === 'completed').length,
    predicate: t => t.status === 'completed',
  },
];

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'week',     label: 'Week'     },
  { key: 'due-date', label: 'Due Date' },
  { key: 'status',   label: 'Status'   },
];

export const STATUS_SORT_ORDER: Record<TaskStatus, number> = { 'in-progress': 0, 'not-started': 1, 'completed': 2 };
