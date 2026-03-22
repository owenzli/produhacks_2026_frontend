import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, User, ChevronRight, CheckCircle2, Shield, Plus, X, LayoutDashboard, Link2, Briefcase
} from 'lucide-react';
import { useApp, ManagerProfile } from '../context/AppContext';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Data', 'IT', 'HR', 'Finance', 'Sales', 'Marketing'];
const TEAM_SIZES = ['1-5', '6-15', '16-50', '50+'];
const COMMS_TOOLS = [
  { id: 'slack', label: 'Slack', icon: '#' },
  { id: 'teams', label: 'MS Teams', icon: 'T' },
  { id: 'email', label: 'Email', icon: '@' },
];

export default function ManagerOnboarding() {
  const navigate = useNavigate();
  const { completeManagerOnboarding } = useApp();
  const [step, setStep] = useState(1);
  
  const [form, setForm] = useState<ManagerProfile>({
    name: '',
    role: '',
    department: 'Engineering',
    avatarUrl: '',
    teamSize: '1-5',
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
      setForm(f => ({
        ...f,
        privateDocs: [...f.privateDocs, { title: newDocTitle.trim(), url: newDocUrl.trim() }]
      }));
      setNewDocTitle('');
      setNewDocUrl('');
    }
  }

  function removeDoc(index: number) {
    setForm(f => ({
      ...f,
      privateDocs: f.privateDocs.filter((_, i) => i !== index)
    }));
  }

  function handleComplete() {
    completeManagerOnboarding(form);
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30 p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Workspace</h1>
          <p className="text-gray-500">Let's set up your manager profile and team primitives.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all text-sm font-semibold shadow-sm ${
                step === s ? 'bg-green-600 text-white ring-4 ring-green-50'
                  : step > s ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-400 border border-gray-200'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {i < 2 && <div className={`w-16 h-1 mx-2 rounded-full transition-colors ${step > s ? 'bg-green-200' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-50/50 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-green-50 p-3 rounded-xl"><User className="w-6 h-6 text-green-600" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Identity</h2>
                    <p className="text-sm text-gray-500">How your team will see you.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Sarah Connor"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                    <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      placeholder="e.g. Director of Engineering"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                  </div>
                </div>

                <div className="flex justify-end mt-10">
                  <button onClick={() => setStep(2)} disabled={!step1Valid}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-md shadow-green-200">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-50 p-3 rounded-xl"><Building2 className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Team Topology</h2>
                    <p className="text-sm text-gray-500">Configure your department settings.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                    <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                    <div className="grid grid-cols-4 gap-3">
                      {TEAM_SIZES.map(size => (
                        <button key={size} onClick={() => setForm(f => ({ ...f, teamSize: size }))}
                          className={`flex items-center justify-center py-2.5 rounded-xl text-sm font-medium border transition-all ${
                            form.teamSize === size ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Comms Tool</label>
                    <div className="grid grid-cols-3 gap-3">
                      {COMMS_TOOLS.map(tool => (
                        <button key={tool.id} onClick={() => setForm(f => ({ ...f, commsTool: tool.id }))}
                          className={`flex flex-col items-center justify-center py-3 gap-1 rounded-xl border transition-all ${
                            form.commsTool === tool.id ? 'bg-green-50 border-green-300 text-green-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}>
                          <span className="text-xl font-bold leading-none">{tool.icon}</span>
                          <span className="text-xs font-semibold">{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-800 px-4 py-3 font-medium transition-colors">Back</button>
                  <button onClick={() => setStep(3)} disabled={!step2Valid}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-md shadow-green-200">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                className="p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-teal-50 p-3 rounded-xl"><Briefcase className="w-6 h-6 text-teal-600" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Private Vault</h2>
                    <p className="text-sm text-gray-500">Links only visible to you (comp bands, review rubrics).</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {form.privateDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 group hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-semibold text-gray-800 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500 truncate">{doc.url}</p>
                        </div>
                      </div>
                      <button onClick={() => removeDoc(idx)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {form.privateDocs.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                      <p className="text-sm text-gray-400">No documents added yet.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddDoc} className="bg-teal-50/40 border border-teal-100 rounded-xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-3">Add private link</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" placeholder="Document Title (e.g. Engineering Rubric)" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none w-full" />
                    <input type="url" placeholder="https://..." value={newDocUrl} onChange={e => setNewDocUrl(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none w-full" />
                  </div>
                  <button type="submit" disabled={!newDocTitle || !newDocUrl}
                    className="w-full flex justify-center items-center gap-2 bg-white border border-teal-200 hover:border-teal-300 hover:bg-teal-50 text-teal-700 font-medium py-2 rounded-lg text-sm transition-all disabled:opacity-50">
                    <Plus className="w-4 h-4" /> Save Link
                  </button>
                </form>

                <div className="flex justify-between mt-10">
                  <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-800 px-4 py-3 font-medium transition-colors">Back</button>
                  <button onClick={handleComplete}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-gray-200">
                    <LayoutDashboard className="w-4 h-4" /> Enter Workspace
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
