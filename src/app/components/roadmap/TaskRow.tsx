import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, Plus, Trash2, Edit3, Save, X, ExternalLink, Link2, FileText, UserCheck, Calendar, Wrench } from 'lucide-react';
import { useApp, Task, TaskStatus, isDocDebt } from '../../context/AppContext';
import { POC_LIST, STATUS_CONFIG, STATUS_CYCLE } from './constants';

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
    const name = host.split('.')[0];
    return { label: name, bg: 'bg-gray-500', text: 'text-white', abbr: name.slice(0, 2).toUpperCase() };
  } catch {
    return { label: 'Link', bg: 'bg-gray-400', text: 'text-white', abbr: '??' };
  }
}

export function DocBadge({ url }: { url: string }) {
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

export function DocDebtPanel({ task, onUpdate, onClose }: {
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

export function TaskRow({ task }: { task: Task }) {
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
