import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkMode, RoleTemplate, TaskStatus, Week, ContactType, HireInfo, Task, TeamContact, HireRecord, CustomTemplate, ManagerProfile } from '../types';
import { generateRoadmapTasks } from '../data/taskTemplates';
import { generateDefaultContacts } from '../data/contactTemplates';

export { generateRoadmapTasks, generateDefaultContacts };

export * from '../types';

export function isDocDebt(task: Task): boolean {
  return !task.linkedDoc && !task.docDebtResolved;
}

const uid = () => Math.random().toString(36).substring(2, 10);

interface AppContextType {
  hires: HireRecord[];
  activeHireId: string | null;
  activeHire: HireRecord | null;
  setActiveHireId: (id: string) => void;
  addHireRecord: (info: HireInfo, tasks: Task[], contacts: TeamContact[]) => string;
  hireInfo: HireInfo | null;
  tasks: Task[];
  roadmapGenerated: boolean;
  launched: boolean;
  contacts: TeamContact[];
  setRoadmapGenerated: (v: boolean) => void;
  setLaunched: (v: boolean) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  addContact: (contact: TeamContact) => void;
  updateContact: (id: string, updates: Partial<TeamContact>) => void;
  removeContact: (id: string) => void;
  setContacts: (contacts: TeamContact[]) => void;
  customTemplates: CustomTemplate[];
  addCustomTemplate: (t: CustomTemplate) => void;
  managerProfile: ManagerProfile | null;
  hasCompletedOnboarding: boolean;
  completeManagerOnboarding: (profile: ManagerProfile) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [hires, setHires] = useState<HireRecord[]>([]);
  const [activeHireId, setActiveHireId] = useState<string | null>(null);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [managerProfile, setManagerProfile] = useState<ManagerProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  function completeManagerOnboarding(profile: ManagerProfile) {
    setManagerProfile(profile);
    setHasCompletedOnboarding(true);
  }

  const activeHire = hires.find(h => h.id === activeHireId) ?? null;

  function updateActiveHire(updater: (hire: HireRecord) => HireRecord) {
    if (!activeHireId) return;
    setHires(prev => prev.map(h => h.id === activeHireId ? updater(h) : h));
  }

  function addHireRecord(info: HireInfo, tasks: Task[], contacts: TeamContact[]): string {
    const id = uid();
    const record: HireRecord = { id, info, tasks, roadmapGenerated: true, launched: false, contacts };
    setHires(prev => [...prev, record]);
    setActiveHireId(id);
    return id;
  }

  const hireInfo = activeHire?.info ?? null;
  const tasks = activeHire?.tasks ?? [];
  const roadmapGenerated = activeHire?.roadmapGenerated ?? false;
  const launched = activeHire?.launched ?? false;
  const contacts = activeHire?.contacts ?? [];

  function setRoadmapGenerated(v: boolean) {
    updateActiveHire(h => ({ ...h, roadmapGenerated: v }));
  }
  function setLaunched(v: boolean) {
    updateActiveHire(h => ({ ...h, launched: v }));
  }
  function updateTask(id: string, updates: Partial<Task>) {
    updateActiveHire(h => ({ ...h, tasks: h.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
  }
  function addTask(task: Task) {
    updateActiveHire(h => ({ ...h, tasks: [...h.tasks, task] }));
  }
  function removeTask(id: string) {
    updateActiveHire(h => ({ ...h, tasks: h.tasks.filter(t => t.id !== id) }));
  }
  function setTasks(tasks: Task[]) {
    updateActiveHire(h => ({ ...h, tasks }));
  }

  function addContact(contact: TeamContact) {
    updateActiveHire(h => ({ ...h, contacts: [...h.contacts, contact] }));
  }
  function updateContact(id: string, updates: Partial<TeamContact>) {
    updateActiveHire(h => ({ ...h, contacts: h.contacts.map(c => c.id === id ? { ...c, ...updates } : c) }));
  }
  function removeContact(id: string) {
    updateActiveHire(h => ({ ...h, contacts: h.contacts.filter(c => c.id !== id) }));
  }
  function setContacts(contacts: TeamContact[]) {
    updateActiveHire(h => ({ ...h, contacts }));
  }

  return (
    <AppContext.Provider value={{
      hires, activeHireId, activeHire,
      setActiveHireId, addHireRecord,
      hireInfo, tasks, roadmapGenerated, launched, contacts,
      setRoadmapGenerated, setLaunched,
      updateTask, addTask, removeTask, setTasks,
      addContact, updateContact, removeContact, setContacts,
      customTemplates, addCustomTemplate: (t: CustomTemplate) => setCustomTemplates(prev => [...prev, t]),
      managerProfile, hasCompletedOnboarding, completeManagerOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}
