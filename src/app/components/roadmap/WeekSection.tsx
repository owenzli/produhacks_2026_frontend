import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Wrench, AlertTriangle, Plus } from 'lucide-react';
import { Task, Week, isDocDebt } from '../../context/AppContext';
import { TaskRow } from './TaskRow';

export function ColumnHeaders() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-t border-b border-gray-100">
      <div className="w-1.5 flex-shrink-0" />
      <div className="flex-1 text-xs text-gray-400 font-medium uppercase tracking-wide">Task</div>
      <div className="w-34 text-xs text-gray-400 font-medium flex-shrink-0 uppercase tracking-wide">Point of Contact</div>
      <div className="w-32 text-xs text-gray-400 font-medium flex-shrink-0 uppercase tracking-wide">Due Date</div>
      <div className="w-36 text-xs text-gray-400 font-medium flex-shrink-0 uppercase tracking-wide">Linked Doc</div>
      <div className="w-28 text-xs text-gray-400 font-medium flex-shrink-0 uppercase tracking-wide">Status</div>
      <div className="w-8 flex-shrink-0" />
    </div>
  );
}

export function WeekSection({
  week, label, sublabel, tasks, onAddTask,
}: {
  week: Week; label: string; sublabel: string; tasks: Task[];
  onAddTask: (w: Week) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const debtCount = tasks.filter(t => isDocDebt(t)).length;
  const techCount = tasks.filter(t => t.isTechnicalSetup).length;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <button onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left">
        {/* Node milestone indicator */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-900 bg-white flex items-center justify-center">
            <span className="text-gray-900 text-xs font-mono font-bold">{week}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{label}</span>
            <span className="text-gray-300 text-sm">—</span>
            <span className="text-gray-500 text-sm">{sublabel}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-mono-label text-gray-400">{tasks.length} tasks</span>
            {techCount > 0 && <span className="font-mono-label text-gray-500 flex items-center gap-1"><Wrench className="w-3 h-3" />{techCount} tech setup</span>}
            {debtCount > 0 && <span className="font-mono-label text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{debtCount} doc debt</span>}
          </div>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <ColumnHeaders />
            <div className="divide-y divide-gray-50">
              {tasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <button onClick={() => onAddTask(week)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 transition-colors">
                <Plus className="w-4 h-4" />Add task to this week
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
