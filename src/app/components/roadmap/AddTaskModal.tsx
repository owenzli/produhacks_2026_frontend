import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Calendar, Wrench, AlignLeft } from 'lucide-react';
import { Task, Week } from '../../context/AppContext';
import { POC_LIST } from './constants';

export function AddTaskModal({ defaultWeek, onAdd, onClose }: {
  defaultWeek: Week;
  onAdd: (task: Task) => void;
  onClose: () => void;
}) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [poc, setPoc]                 = useState('Manager');
  const [week, setWeek]               = useState<Week>(defaultWeek);
  const [dueDate, setDueDate]         = useState(new Date().toISOString().split('T')[0]);
  const [isTech, setIsTech]           = useState(false);

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({
      id: Math.random().toString(36).substring(2, 10),
      title: title.trim(),
      description: description.trim() || undefined,
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white border border-gray-200 shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-900 flex items-center justify-center flex-shrink-0">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-mono-label text-gray-400">new task</p>
            <h2 className="text-gray-900">Add Custom Task</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-sm transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Task Title <span className="text-red-400">*</span></label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleAdd(); if (e.key === 'Escape') onClose(); }}
              placeholder="e.g. Complete security training module"
              className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3 h-3 text-gray-400" />
              Description <span className="text-gray-300 font-normal ml-1">optional</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add context, links, or acceptance criteria…"
              rows={3}
              className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all resize-none leading-relaxed"
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
              className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-200" />
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm text-gray-700">Mark as Technical Setup task</span>
            </div>
          </label>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
          <button onClick={handleAdd} disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-sm transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />Add Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
