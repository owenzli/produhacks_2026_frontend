import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Calendar, Wrench } from 'lucide-react';
import { Task, Week } from '../../context/AppContext';
import { POC_LIST } from './constants';

export function AddTaskModal({ defaultWeek, onAdd, onClose }: {
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
        className="bg-white rounded-sm shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-gray-900 rounded-sm flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Add Custom Task</h2>
            <p className="text-gray-400 text-sm">Fill in the task details below</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 hover:bg-gray-100 rounded-sm transition-colors">
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
              className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
            />
          </div>

          {/* POC + Week row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Point of Contact</label>
              <select value={poc} onChange={e => setPoc(e.target.value)}
                className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300">
                {POC_LIST.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Week</label>
              <select value={week} onChange={e => setWeek(Number(e.target.value) as Week)}
                className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300">
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
                className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300" />
            </div>
          </div>

          {/* Tech setup toggle */}
          <label className="flex items-center gap-3 p-3 rounded-sm border border-gray-100 bg-gray-50/60 cursor-pointer hover:bg-blue-50/40 hover:border-blue-100 transition-all">
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
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
          <button onClick={handleAdd} disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-sm transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />Add Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
