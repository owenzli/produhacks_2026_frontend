import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2, Plus, X, LayoutDashboard, Link2 } from 'lucide-react';
import { useApp, ManagerProfile } from '../context/AppContext';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Data', 'IT', 'HR', 'Finance', 'Sales', 'Marketing'];
const TEAM_SIZES = ['1–5', '6–15', '16–50', '50+'];
const COMMS_TOOLS = [
  { id: 'slack', label: 'Slack' },
  { id: 'teams', label: 'MS Teams' },
  { id: 'email', label: 'Email' },
];

const STEPS = ['Identity', 'Team', 'Vault'];

export default function ManagerOnboarding() {
  const navigate = useNavigate();
  const { completeManagerOnboarding } = useApp();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<ManagerProfile>({
    name: '',
    role: '',
    department: 'Engineering',
    avatarUrl: '',
    teamSize: '1–5',
    commsTool: 'slack',
    privateDocs: [
      { title: 'Manager Handbook', url: 'https://notion.so/handbook' }
    ]
  });

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');

  const step1Valid = form.name.trim() && form.role.trim();
  const step2Valid = !!form.department && !!form.teamSize && !!form.commsTool;

  function handleAddDoc(e: React.FormEvent) {
    e.preventDefault();
    if (newDocTitle.trim() && newDocUrl.trim()) {
      setForm(f => ({ ...f, privateDocs: [...f.privateDocs, { title: newDocTitle.trim(), url: newDocUrl.trim() }] }));
      setNewDocTitle('');
      setNewDocUrl('');
    }
  }

  function removeDoc(index: number) {
    setForm(f => ({ ...f, privateDocs: f.privateDocs.filter((_, i) => i !== index) }));
  }

  function handleComplete() {
    completeManagerOnboarding(form);
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">

        {/* Wordmark */}
        <div className="mb-7">
          <p className="font-mono-label text-gray-400 mb-1">launchpath / init</p>
          <h1 className="text-gray-900">Welcome to <span className="italic">LaunchPath</span></h1>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Let's configure your workspace. LaunchPath will use these settings to generate personalized,
            week-by-week onboarding plans for every hire you make.
          </p>
        </div>

        {/* Node-based step track */}
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => {
            const s = i + 1;
            const isDone = step > s;
            const isActive = step === s;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all text-xs font-mono font-bold ${isDone ? 'bg-gray-900 border-gray-900 text-white' :
                      isActive ? 'bg-white border-gray-900 text-gray-900' :
                        'bg-white border-gray-300 text-gray-400'
                    }`}>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className={`font-mono-label tracking-wider ${isActive ? 'text-gray-900' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 mx-2 mb-5 border-t-2 border-dashed transition-colors ${step > s ? 'border-gray-700' : 'border-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="border border-gray-200 bg-white overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── Step 1 ── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }}
                className="p-5">
                <p className="font-mono-label text-gray-400 mb-5">01 / Identity</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Sarah Connor"
                      className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                    <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      placeholder="e.g. VP of Engineering"
                      className="input-field" />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button onClick={() => setStep(2)} disabled={!step1Valid}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 text-sm font-medium transition-colors">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }}
                className="p-5">
                <p className="font-mono-label text-gray-400 mb-5">02 / Team Topology</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                    <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-900 focus:outline-none focus:border-gray-500 transition-colors">
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TEAM_SIZES.map(size => (
                        <button key={size} onClick={() => setForm(f => ({ ...f, teamSize: size }))}
                          className={`py-2.5 text-sm font-medium border transition-all ${form.teamSize === size ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Comms Tool</label>
                    <div className="grid grid-cols-3 gap-2">
                      {COMMS_TOOLS.map(tool => (
                        <button key={tool.id} onClick={() => setForm(f => ({ ...f, commsTool: tool.id }))}
                          className={`py-2.5 text-sm font-medium border transition-all ${form.commsTool === tool.id ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}>
                          {tool.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
                  <button onClick={() => setStep(3)} disabled={!step2Valid}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 text-sm font-medium transition-colors">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }}
                className="p-5">
                <p className="font-mono-label text-gray-400 mb-1">03 / Private Vault</p>
                <p className="text-xs text-gray-500 mb-5">Links visible only to you — comp bands, leveling rubrics, interview scorecards.</p>

                <div className="space-y-2 mb-5 max-h-44 overflow-y-auto custom-scrollbar">
                  {form.privateDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-2.5 border border-gray-200 bg-gray-50 group hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-800 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-400 font-mono truncate">{doc.url}</p>
                        </div>
                      </div>
                      <button onClick={() => removeDoc(idx)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {form.privateDocs.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-gray-200 bg-gray-50/50">
                      <p className="text-sm text-gray-400">No documents configured.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddDoc} className="border border-dashed border-gray-300 p-4 bg-gray-50/50">
                  <p className="font-mono-label text-gray-400 mb-3">Add link</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="text" placeholder="Title (e.g. Comp Bands)" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)}
                      className="input-field text-sm py-2 px-3" />
                    <input type="url" placeholder="https://..." value={newDocUrl} onChange={e => setNewDocUrl(e.target.value)}
                      className="input-field text-sm py-2 px-3" />
                  </div>
                  <button type="submit" disabled={!newDocTitle || !newDocUrl}
                    className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-gray-700 font-medium py-2 text-sm transition-all disabled:opacity-50">
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </button>
                </form>

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back</button>
                  <button onClick={handleComplete}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 text-sm font-medium transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Enter Workspace
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6 text-center font-mono">
          LaunchPath · Series A Onboarding Intelligence
        </p>
      </div>
    </div>
  );
}
