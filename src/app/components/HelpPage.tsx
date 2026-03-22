import { useState } from 'react';
import {
  HelpCircle, Wand2, Map, Users, ChevronDown, ChevronUp,
  Wrench, AlertTriangle, Filter, Eye, Rocket, Search,
  BookOpen, Zap, MessageCircle, ArrowRight, CheckCircle2,
  LayoutList, Flag, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem { q: string; a: string; }

const FAQ: FAQItem[] = [
  {
    q: 'What is Doc Debt?',
    a: 'Doc Debt flags tasks that are missing a linked documentation resource. Before launching a plan, all tasks should either have a linked doc, a written note explaining the process, or an assigned owner who holds the knowledge.',
  },
  {
    q: 'How do I switch between new hires?',
    a: 'Use the Active Hire dropdown in the top of the left sidebar. Click it to see all your hires and switch between them. You can also add a new hire from this dropdown.',
  },
  {
    q: 'What does "Completable Now" filter show?',
    a: '"Completable Now" surfaces tasks that are in Not Started status and have no documentation blockers (i.e. no doc debt). These are ready to be actioned immediately by you or the assigned contact.',
  },
  {
    q: 'Can I add custom tasks to a roadmap?',
    a: 'Yes. Within each week section on the Roadmap Review screen, click "Add custom task" to open a dialog where you can set the title, point of contact, week, and due date.',
  },
  {
    q: 'What happens when I click "Approve & Launch"?',
    a: 'Launching activates the new hire\'s view — they can see their checklist, progress ring, and team contacts. You\'ll be taken to the New Hire View so you can preview what they see.',
  },
  {
    q: 'How do I resolve a Doc Debt item?',
    a: 'Click the amber "Doc Debt" badge on any task to open the resolve panel. You can link an existing doc, write a short note, or assign an owner who can provide context.',
  },
  {
    q: 'Can I edit task titles after generating the roadmap?',
    a: 'Yes. Hover over any task row and click the pencil icon that appears to enter edit mode. Press Enter or click the save button to confirm changes.',
  },
  {
    q: 'What are role templates?',
    a: 'Role templates are pre-built sets of onboarding tasks tailored to specific roles and departments. There are 16 templates across 7 departments, each with week-by-week tasks appropriate for that role.',
  },
];

interface FeatureCard {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
}

const FEATURES: FeatureCard[] = [
  { icon: Wand2,        color: 'from-green-500 to-gray-900',  title: 'Onboarding Wizard',   desc: 'Enter new hire details, select a role template, and generate a complete week-by-week roadmap in one flow.' },
  { icon: Map,          color: 'from-green-500 to-green-700',    title: 'Roadmap Review',       desc: 'Edit tasks, assign points of contact, link docs, flag doc debt, and approve the plan for launch.' },
  { icon: Filter,       color: 'from-purple-500 to-violet-600',  title: 'Smart Filters',        desc: 'Filter tasks by type (Tech Setup, Doc Debt, Overdue, Completable Now) and sort by week, due date, or status.' },
  { icon: AlertTriangle,color: 'from-amber-500 to-orange-500',   title: 'Doc Debt Tracking',    desc: 'Tasks without linked documentation are flagged automatically. Resolve them before launch using links, notes, or owner assignments.' },
  { icon: Users,        color: 'from-teal-500 to-cyan-600',      title: 'Team Setup',           desc: 'Add onboarding contacts and team collaborators with roles, responsibilities, and scheduling links.' },
  { icon: Eye,          color: 'from-rose-500 to-pink-600',      title: 'New Hire View',        desc: 'Preview what your new hire will see: a progress ring, task checklist, and team contact cards.' },
  { icon: Rocket,       color: 'from-gray-800 to-black',  title: 'Approve & Launch',     desc: 'When ready, launch the plan to activate the new hire\'s view. Unresolved doc debt is flagged before you proceed.' },
  { icon: LayoutList,   color: 'from-gray-600 to-gray-700',      title: 'Multi-Hire Sidebar',   desc: 'Manage multiple new hires from a single workspace. Switch context instantly via the hire switcher dropdown.' },
];

const SHORTCUTS = [
  { keys: ['Enter'], action: 'Save task title when editing' },
  { keys: ['Escape'], action: 'Cancel task title edit' },
  { keys: ['Click badge'], action: 'Open Doc Debt resolve panel' },
  { keys: ['Click status'], action: 'Open status dropdown' },
  { keys: ['Hover row'], action: 'Reveal edit & delete actions' },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-sm overflow-hidden transition-all ${open ? 'border-gray-200' : 'border-gray-100'}`}>
      <button onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${open ? 'bg-gray-50/60' : 'bg-white hover:bg-gray-50'}`}>
        <span className={`text-sm font-medium flex-1 ${open ? 'text-gray-900' : 'text-gray-700'}`}>{item.q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-900 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-5 py-4 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const filteredFAQ = FAQ.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-grid">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-gray-900 rounded-sm flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">Help & Documentation</h1>
            <p className="text-gray-400 text-sm">Everything you need to get the most out of LaunchPath</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-10">

        <section>
          <p className="font-mono-label text-gray-400 mb-1">01 / start</p>
          <h2 className="text-gray-900 mb-4">Quick Start</h2>
          <div className="bg-white border border-gray-100 p-5">
            <div className="flex flex-col gap-3">
              {[
                { step: 1, icon: Wand2, label: 'Open the Onboarding Wizard', desc: 'Enter the new hire\'s name, role, department, start date, and work mode.' },
                { step: 2, icon: Flag,  label: 'Choose a role template',      desc: 'Select from 16 templates across 7 departments to auto-generate tasks.' },
                { step: 3, icon: Map,   label: 'Review and edit the roadmap', desc: 'Add docs, assign points of contact, fix doc debt, and add custom tasks.' },
                { step: 4, icon: Users, label: 'Set up the team',             desc: 'Add onboarding contacts and collaborators on the Team & Contacts tab.' },
                { step: 5, icon: Rocket,label: 'Approve & Launch',            desc: 'Click "Approve & Launch" to activate the new hire\'s view.' },
              ].map((s, i) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-7 h-7 bg-gray-900 flex items-center justify-center flex-shrink-0 text-white">
                    <s.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                  {i < 4 && (
                    <div className="self-stretch flex items-center">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-200 flex-shrink-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <p className="font-mono-label text-gray-400 mb-1">02 / features</p>
          <h2 className="text-gray-900 mb-4">Feature Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white border border-gray-100 p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{f.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard shortcuts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-gray-900" />
            <h2 className="text-gray-800">Tips & Shortcuts</h2>
          </div>
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            {SHORTCUTS.map((s, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-3 ${i < SHORTCUTS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex gap-1.5">
                  {s.keys.map(k => (
                    <kbd key={k} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-600">{k}</kbd>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{s.action}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-gray-900" />
            <h2 className="text-gray-800">Frequently Asked Questions</h2>
          </div>

          {/* FAQ Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-4 py-2.5 mb-4 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="flex-1 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>

          <div className="space-y-2">
            {filteredFAQ.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <FileText className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No matching questions found</p>
              </div>
            ) : (
              filteredFAQ.map((item, i) => <FAQAccordion key={i} item={item} />)
            )}
          </div>
        </section>

        <section>
          <div className="bg-gray-900 p-5 text-white">
            <p className="font-mono-label text-white/40 mb-2">support</p>
            <h3 className="font-bold text-lg tracking-tight mb-1">Still need help?</h3>
            <p className="text-white/60 text-sm mb-4">Reach out to your LaunchPath admin or send us a message and we'll get back to you within one business day.</p>
            <button className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
