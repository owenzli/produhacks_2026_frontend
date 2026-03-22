import { useState } from 'react';
import {
  Users, UserCheck, Network, Plus, Trash2, Edit3, Save, X,
  Mail, Calendar, Tag, ChevronDown, CheckCircle2
} from 'lucide-react';
import { useApp, TeamContact, ContactType } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-rose-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
  'from-pink-400 to-pink-600',
  'from-cyan-500 to-cyan-700',
  'from-lime-400 to-green-600',
  'from-fuchsia-400 to-fuchsia-600',
];

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Data', 'Platform', 'Security', 'QA', 'IT', 'HR', 'Finance', 'Legal', 'Marketing'];

const uid = () => Math.random().toString(36).substring(2, 10);

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

interface ContactCardProps {
  contact: TeamContact;
  onUpdate: (id: string, updates: Partial<TeamContact>) => void;
  onRemove: (id: string) => void;
}

function ContactCard({ contact, onUpdate, onRemove }: ContactCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(contact);
  const [newResp, setNewResp] = useState('');

  function save() {
    onUpdate(contact.id, draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(contact);
    setEditing(false);
  }

  function addResp() {
    if (newResp.trim()) {
      setDraft(d => ({ ...d, responsibilities: [...d.responsibilities, newResp.trim()] }));
      setNewResp('');
    }
  }

  function removeResp(i: number) {
    setDraft(d => ({ ...d, responsibilities: d.responsibilities.filter((_, idx) => idx !== i) }));
  }

  if (editing) {
    return (
      <motion.div layout className="bg-white border-2 border-green-300 rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${draft.avatarColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-semibold">{initials(draft.name || '?')}</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Full name"
              className="col-span-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            <input value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
              placeholder="Role / Title"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            <select value={draft.department} onChange={e => setDraft(d => ({ ...d, department: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 bg-white">
              {DEPARTMENTS.map(dep => <option key={dep}>{dep}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <input value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
            placeholder="email@company.com"
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
          <input value={draft.scheduleLink} onChange={e => setDraft(d => ({ ...d, scheduleLink: e.target.value }))}
            placeholder="https://calendly.com/..."
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5 font-medium">Responsibilities</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {draft.responsibilities.map((r, i) => (
              <span key={i} className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                {r}
                <button onClick={() => removeResp(i)} className="hover:text-red-500 transition-colors">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newResp} onChange={e => setNewResp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addResp()}
              placeholder="Add responsibility…"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            <button onClick={addResp} className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
              <Plus className="w-4 h-4 text-green-700" />
            </button>
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1.5 font-medium">Avatar Color</p>
          <div className="flex gap-1.5 flex-wrap">
            {AVATAR_COLORS.map(c => (
              <button key={c} onClick={() => setDraft(d => ({ ...d, avatarColor: c }))}
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} flex items-center justify-center border-2 transition-all ${draft.avatarColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}>
                {draft.avatarColor === c && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={cancel} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-sm transition-colors hover:bg-gray-50">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button onClick={save} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition-colors">
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-sm transition-all group">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="text-white font-semibold text-sm">{initials(contact.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{contact.name}</p>
          <p className="text-sm text-gray-500">{contact.role}</p>
          <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{contact.department}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => { setDraft(contact); setEditing(true); }}
            className="p-1.5 hover:bg-green-50 rounded-lg transition-colors">
            <Edit3 className="w-3.5 h-3.5 text-gray-400 hover:text-green-600" />
          </button>
          <button onClick={() => onRemove(contact.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {contact.responsibilities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {contact.responsibilities.map((r, i) => (
            <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
              {r}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 pt-3 border-t border-gray-50 flex-wrap">
        {contact.email && (
          <a href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors">
            <Mail className="w-3 h-3" />
            {contact.email}
          </a>
        )}
        {contact.scheduleLink && (
          <a href={contact.scheduleLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors">
            <Calendar className="w-3 h-3" />
            Schedule 1:1
          </a>
        )}
      </div>
    </motion.div>
  );
}

function AddContactForm({ type, onAdd, onClose }: {
  type: ContactType;
  onAdd: (c: TeamContact) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: '', role: '', department: 'Engineering', email: '', scheduleLink: '',
    responsibilities: [] as string[], avatarColor: AVATAR_COLORS[0],
  });
  const [newResp, setNewResp] = useState('');

  function addResp() {
    if (newResp.trim()) {
      setForm(f => ({ ...f, responsibilities: [...f.responsibilities, newResp.trim()] }));
      setNewResp('');
    }
  }

  function submit() {
    if (!form.name.trim() || !form.role.trim()) return;
    onAdd({
      id: uid(),
      contactType: type,
      ...form,
    });
    onClose();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-dashed border-green-300 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-medium text-gray-800 text-sm">
          {type === 'onboarding' ? '+ Add Onboarding Contact' : '+ Add Collaborator'}
        </p>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name *"
          className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
        <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Role / Title *"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
        <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 bg-white">
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@company.com"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
        <input value={form.scheduleLink} onChange={e => setForm(f => ({ ...f, scheduleLink: e.target.value }))} placeholder="Calendly / booking link"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.responsibilities.map((r, i) => (
            <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">
              {r}
              <button onClick={() => setForm(f => ({ ...f, responsibilities: f.responsibilities.filter((_, idx) => idx !== i) }))}>
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newResp} onChange={e => setNewResp(e.target.value)} onKeyDown={e => e.key === 'Enter' && addResp()}
            placeholder="Add a responsibility (e.g. Code reviews)…"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
          <button onClick={addResp} className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
            <Plus className="w-4 h-4 text-green-700" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {AVATAR_COLORS.slice(0, 6).map(c => (
            <button key={c} onClick={() => setForm(f => ({ ...f, avatarColor: c }))}
              className={`w-5 h-5 rounded-full bg-gradient-to-br ${c} border-2 transition-all ${form.avatarColor === c ? 'border-gray-700 scale-125' : 'border-transparent'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="text-gray-500 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={submit} disabled={!form.name.trim() || !form.role.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-sm px-4 py-1.5 rounded-lg transition-colors">
            Add Contact
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSetup() {
  const { contacts, addContact, updateContact, removeContact, hireInfo } = useApp();
  const [addingType, setAddingType] = useState<ContactType | null>(null);

  const onboardingContacts = contacts.filter(c => c.contactType === 'onboarding');
  const collaborators = contacts.filter(c => c.contactType === 'collaborator');

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="text-gray-900 font-semibold">Team Contacts for {hireInfo?.name ?? 'New Hire'}</h3>
            <p className="text-gray-600 text-sm mt-0.5">
              These contacts will appear on {hireInfo?.name?.split(' ')[0] ?? 'the new hire'}'s onboarding page so they can reach out,
              schedule 1:1s, and know exactly who to contact for each part of their setup.
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Team */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Onboarding Team</h3>
              <p className="text-gray-500 text-xs mt-0.5">People who grant access, lead setup, or guide the new hire directly</p>
            </div>
            <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{onboardingContacts.length}</span>
          </div>
          <button
            onClick={() => setAddingType(addingType === 'onboarding' ? null : 'onboarding')}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Person
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {addingType === 'onboarding' && (
              <AddContactForm key="add-onboarding" type="onboarding" onAdd={addContact} onClose={() => setAddingType(null)} />
            )}
          </AnimatePresence>

          {onboardingContacts.length === 0 && addingType !== 'onboarding' ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No onboarding contacts yet</p>
              <button onClick={() => setAddingType('onboarding')} className="text-xs text-green-600 hover:underline mt-1">Add the first one</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {onboardingContacts.map(c => (
                <ContactCard key={c.id} contact={c} onUpdate={updateContact} onRemove={removeContact} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collaborators Rolodex */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Network className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Team Rolodex</h3>
              <p className="text-gray-500 text-xs mt-0.5">Close collaborators & cross-functional partners the new hire will work with</p>
            </div>
            <span className="ml-1 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">{collaborators.length}</span>
          </div>
          <button
            onClick={() => setAddingType(addingType === 'collaborator' ? null : 'collaborator')}
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Person
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {addingType === 'collaborator' && (
              <AddContactForm key="add-collab" type="collaborator" onAdd={addContact} onClose={() => setAddingType(null)} />
            )}
          </AnimatePresence>

          {collaborators.length === 0 && addingType !== 'collaborator' ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
              <Network className="w-8 h-8 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No collaborators added yet</p>
              <button onClick={() => setAddingType('collaborator')} className="text-xs text-green-600 hover:underline mt-1">Add collaborators</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {collaborators.map(c => (
                <ContactCard key={c.id} contact={c} onUpdate={updateContact} onRemove={removeContact} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
