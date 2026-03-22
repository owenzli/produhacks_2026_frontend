import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Link2 } from 'lucide-react';
import { useApp, ManagerProfile } from '../context/AppContext';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Data', 'IT', 'HR', 'Finance', 'Sales', 'Marketing'];
const TEAM_SIZES = ['1-5', '6-15', '16-50', '50+'];
const COMMS_TOOLS = [
  { id: 'slack', label: 'Slack' },
  { id: 'teams', label: 'MS Teams' },
  { id: 'email', label: 'Email Only' },
];

export function ManagerSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { managerProfile, completeManagerOnboarding } = useApp();
  const [form, setForm] = useState<ManagerProfile | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Sync form when opened
  useEffect(() => {
    if (isOpen && managerProfile) {
      setForm({ ...managerProfile });
    }
  }, [isOpen, managerProfile]);

  function handleSave() {
    if (form) {
      completeManagerOnboarding(form);
      onClose();
    }
  }

  function addDoc(e: React.FormEvent) {
    e.preventDefault();
    if (newTitle.trim() && newUrl.trim() && form) {
      setForm({
        ...form,
        privateDocs: [...form.privateDocs, { title: newTitle.trim(), url: newUrl.trim() }]
      });
      setNewTitle('');
      setNewUrl('');
    }
  }
  
  function removeDoc(index: number) {
    if (form) {
      setForm({
        ...form,
        privateDocs: form.privateDocs.filter((_, i) => i !== index)
      });
    }
  }

  return (
    <AnimatePresence>
      {isOpen && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px]" onClick={onClose} />
          
          {/* Modal */}
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }}
            className="relative bg-white rounded shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Workspace Settings</h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-sm hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-sm px-4 py-2.5 bg-gray-50 focus:bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                    <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                      className="w-full border border-gray-200 rounded-sm px-4 py-2.5 bg-gray-50 focus:bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Team Topology</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full border border-gray-200 rounded-sm px-4 py-2.5 bg-gray-50 focus:bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 transition-colors appearance-none">
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Size</label>
                    <select value={form.teamSize} onChange={e => setForm({ ...form, teamSize: e.target.value })}
                      className="w-full border border-gray-200 rounded-sm px-4 py-2.5 bg-gray-50 focus:bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 transition-colors appearance-none">
                      {TEAM_SIZES.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Comms Tool</label>
                    <select value={form.commsTool} onChange={e => setForm({ ...form, commsTool: e.target.value })}
                      className="w-full border border-gray-200 rounded-sm px-4 py-2.5 bg-gray-50 focus:bg-white text-gray-800 outline-none focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 transition-colors appearance-none">
                      {COMMS_TOOLS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Private Vault Links</h3>
                <div className="space-y-2">
                  {form.privateDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-sm border border-gray-200 bg-white group hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-700 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-400 truncate">{doc.url}</p>
                        </div>
                      </div>
                      <button onClick={() => removeDoc(idx)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.privateDocs.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-sm bg-gray-50/50">
                      <p className="text-sm text-gray-400">No private documents configured.</p>
                    </div>
                  )}
                </div>
                
                <form onSubmit={addDoc} className="grid grid-cols-[1fr_1fr_auto] gap-3 mt-4">
                  <input type="text" placeholder="Title (e.g. Rubric...)" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 outline-none" />
                  <input type="url" placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)}
                    className="border border-gray-200 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-gray-1000/20 focus:border-gray-500 outline-none" />
                  <button type="submit" disabled={!newTitle || !newUrl}
                    className="flex justify-center items-center gap-1.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-sm text-sm transition-all disabled:opacity-50">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-end border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
              <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 mr-2 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-all shadow-md shadow-gray-200 active:scale-95">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
