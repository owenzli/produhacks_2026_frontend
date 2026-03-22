import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Wand2, ChevronRight, ChevronLeft, Code2, Server, Layers,
  Rocket, Users2, CheckCircle2, Loader2, Sparkles, Calendar,
  Building2, User, Plus, Target, BarChart2, Palette, Search,
  Database, ShieldCheck, ClipboardCheck, Activity, Cpu, BarChart,
  Star, Crown, Hexagon, Zap
} from 'lucide-react';
import { useApp, HireInfo, RoleTemplate, WorkMode, generateRoadmapTasks, generateDefaultContacts } from '../context/AppContext';
import { motion } from 'motion/react';

interface TemplateOption {
  id: RoleTemplate;
  label: string;
  icon: React.ElementType;
  color: string;
  taskCount: number;
  focus: string[];
}

const TEMPLATES_BY_DEPARTMENT: Record<string, TemplateOption[]> = {
  Engineering: [
    { id: 'frontend', label: 'Frontend Engineer', icon: Code2, color: 'from-blue-500 to-indigo-600', taskCount: 15, focus: ['React / TypeScript', 'UI Components', 'Design System'] },
    { id: 'backend', label: 'Backend Engineer', icon: Server, color: 'from-purple-500 to-violet-600', taskCount: 14, focus: ['APIs & Services', 'Databases', 'Security'] },
    { id: 'fullstack', label: 'Full-Stack Engineer', icon: Layers, color: 'from-green-500 to-emerald-600', taskCount: 18, focus: ['Frontend + Backend', 'E2E Features', 'System Design'] },
    { id: 'engineering-manager', label: 'Engineering Manager', icon: Users2, color: 'from-rose-500 to-pink-600', taskCount: 14, focus: ['Team Leadership', 'Strategy', 'People Ops'] },
  ],
  Platform: [
    { id: 'devops', label: 'DevOps Engineer', icon: Rocket, color: 'from-orange-500 to-amber-600', taskCount: 15, focus: ['Infrastructure', 'CI/CD Pipelines', 'On-Call'] },
    { id: 'sre', label: 'Site Reliability Engineer', icon: Activity, color: 'from-cyan-500 to-teal-600', taskCount: 15, focus: ['SLOs & SLIs', 'Incident Response', 'Capacity Planning'] },
  ],
  Product: [
    { id: 'product-manager', label: 'Product Manager', icon: Target, color: 'from-violet-500 to-purple-600', taskCount: 15, focus: ['Roadmap & OKRs', 'PRD Writing', 'Sprint Facilitation'] },
    { id: 'product-analyst', label: 'Product Analyst', icon: BarChart2, color: 'from-sky-500 to-blue-600', taskCount: 12, focus: ['A/B Testing', 'Dashboards', 'Metrics & KPIs'] },
  ],
  Design: [
    { id: 'product-designer', label: 'Product Designer', icon: Palette, color: 'from-pink-500 to-rose-600', taskCount: 14, focus: ['Figma & Design System', 'UX Critique', 'Prototyping'] },
    { id: 'ux-researcher', label: 'UX Researcher', icon: Search, color: 'from-amber-500 to-orange-600', taskCount: 12, focus: ['User Interviews', 'Research Synthesis', 'Usability Studies'] },
  ],
  Data: [
    { id: 'data-analyst', label: 'Data Analyst', icon: BarChart, color: 'from-teal-500 to-emerald-600', taskCount: 13, focus: ['SQL & BI Tools', 'Dashboards', 'Stakeholder Reports'] },
    { id: 'data-scientist', label: 'Data Scientist', icon: Cpu, color: 'from-indigo-500 to-violet-600', taskCount: 12, focus: ['ML Models', 'Experiment Design', 'Python / Notebooks'] },
    { id: 'data-engineer', label: 'Data Engineer', icon: Database, color: 'from-green-600 to-teal-600', taskCount: 12, focus: ['Pipelines & ETL', 'dbt / Airflow', 'Data Warehouse'] },
  ],
  Security: [
    { id: 'security-engineer', label: 'Security Engineer', icon: ShieldCheck, color: 'from-red-500 to-rose-600', taskCount: 12, focus: ['Threat Modelling', 'IAM & Access', 'Vulnerability Assessment'] },
  ],
  QA: [
    { id: 'qa-engineer', label: 'QA Engineer', icon: ClipboardCheck, color: 'from-lime-500 to-green-600', taskCount: 12, focus: ['Test Plans', 'Exploratory Testing', 'Release Sign-off'] },
    { id: 'sdet', label: 'SDET', icon: Code2, color: 'from-fuchsia-500 to-purple-600', taskCount: 12, focus: ['Test Automation', 'CI Integration', 'Framework Design'] },
  ],
};

// The flat combined list is now generated inside the component

const DEPARTMENTS = Object.keys(TEMPLATES_BY_DEPARTMENT);

const WORK_MODES: { value: WorkMode; label: string; icon: string }[] = [
  { value: 'remote', label: 'Remote', icon: '🌐' },
  { value: 'hybrid', label: 'Hybrid', icon: '🏡' },
  { value: 'in-office', label: 'In-Office', icon: '🏢' },
];

const PREVIEW_WEEKS = [
  { week: 'Week 1', tasks: ['GitHub access', 'Dev environment', 'Team introductions', 'Architecture review'] },
  { week: 'Week 2', tasks: ['First ticket', 'Code standards review', 'CI/CD walkthrough'] },
  { week: 'Week 3', tasks: ['First PR submission', 'Performance review', 'Testing standards'] },
  { week: 'Week 4+', tasks: ['30-day check-in', 'Feature ownership', 'Goals setting'] },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { addHireRecord, hires, customTemplates } = useApp();
  
  const templatesByDept: Record<string, TemplateOption[]> = {};
  for (const [dept, templates] of Object.entries(TEMPLATES_BY_DEPARTMENT)) {
    templatesByDept[dept] = [...templates];
  }
  
  const iconMap: Record<string, React.ElementType> = { Star, Crown, Hexagon, Zap };
  customTemplates.forEach(ct => {
    if (!templatesByDept[ct.department]) {
      templatesByDept[ct.department] = [];
    }
    templatesByDept[ct.department].push({
      id: ct.id,
      label: ct.label,
      icon: iconMap[ct.iconName] || Star,
      color: ct.color,
      taskCount: ct.tasks.length,
      focus: ['Custom Template'],
    });
  });

  const ALL_TEMPLATES_MERGED = Object.values(templatesByDept).flat();

  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedWeeks, setGeneratedWeeks] = useState<number[]>([]);

  const [form, setForm] = useState({
    name: '',
    roleTitle: '',
    department: 'Engineering',
    startDate: '',
    workMode: 'hybrid' as WorkMode,
    onboardingDuration: 2,
  });
  const [template, setTemplate] = useState<RoleTemplate | null>(null);

  const currentTemplates = templatesByDept[form.department] ?? [];

  function handleDepartmentChange(dept: string) {
    setForm(f => ({ ...f, department: dept }));
    setTemplate(null); // reset template when dept changes
  }

  const step1Valid = form.name.trim() && form.roleTitle.trim() && form.startDate;
  const step2Valid = !!template;

  function handleGenerate() {
    if (!template) return;
    const info: HireInfo = { ...form, template };
    setGenerating(true);
    setGeneratedWeeks([]);

    [0, 1, 2, 3].forEach(i => {
      setTimeout(() => {
        setGeneratedWeeks(prev => [...prev, i]);
      }, 500 + i * 600);
    });

    setTimeout(() => {
      const tasks = generateRoadmapTasks(info);
      const contacts = generateDefaultContacts(template);
      addHireRecord(info, tasks, contacts);
      navigate('/roadmap');
    }, 3400);
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Wand2 className="w-5 h-5" />
                <span className="text-sm font-medium">Onboarding Wizard</span>
              </div>
              <h1 className="text-gray-900">Set Up a New Hire Onboarding Plan</h1>
              <p className="text-gray-500 mt-1">Complete three steps to generate a personalized week-by-week roadmap.</p>
            </div>
            {hires.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-right">
                <p className="text-xs text-green-600 font-medium">{hires.length} hire{hires.length !== 1 ? 's' : ''} active</p>
                <p className="text-xs text-gray-500 mt-0.5">Adding another one</p>
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                step === s ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : step > s ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : (
                  <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold">{s}</span>
                )}
                <span className="text-sm font-medium hidden sm:inline">
                  {s === 1 ? 'New Hire Info' : s === 2 ? 'Role Template' : 'Generate Roadmap'}
                </span>
              </div>
              {i < 2 && <div className={`w-10 h-0.5 mx-1 transition-colors ${step > s ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-gray-900">New Hire Information</h2>
                <p className="text-gray-500 text-sm">Enter basic details about your new team member.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Alex Chen"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Role Title <span className="text-red-400">*</span></label>
                <input type="text" value={form.roleTitle} onChange={e => setForm(f => ({ ...f, roleTitle: e.target.value }))}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={form.department} onChange={e => handleDepartmentChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 appearance-none bg-white transition-all">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Start Date <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Work Mode</label>
                <div className="flex gap-2">
                  {WORK_MODES.map(m => (
                    <button key={m.value} onClick={() => setForm(f => ({ ...f, workMode: m.value }))}
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-sm transition-all ${
                        form.workMode === m.value ? 'border-green-400 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}>
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2 mt-2 bg-green-50/50 p-5 rounded-xl border border-green-100">
                <label className="block text-sm text-gray-700 mb-3 flex items-center justify-between">
                  <span className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-green-600" /> Onboarding Duration</span>
                  <span className="font-bold text-green-700 bg-white px-3 py-1 rounded-full border border-green-200 shadow-sm">{form.onboardingDuration} Weeks</span>
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 font-medium w-16 text-right">2 weeks</span>
                  <input type="range" min="2" max="12" step="1" 
                    value={form.onboardingDuration} onChange={e => setForm(f => ({ ...f, onboardingDuration: parseInt(e.target.value) }))}
                    className="flex-1 h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                  <span className="text-xs text-gray-500 font-medium w-16">3 months</span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  {form.onboardingDuration === 2 ? "Standard 2-week quick ramp-up. Tasks will be highly compressed." : 
                   form.onboardingDuration > 8 ? "Deep integration phase. Roadmaps will stretch milestone evaluations to " + form.onboardingDuration + " weeks." : 
                   "Balanced onboarding spread across " + form.onboardingDuration + " weeks."}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors shadow-sm">
                Next: Choose Template <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Layers className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Select a Role Template</h2>
                    <p className="text-gray-500 text-sm">Templates auto-populate tasks, tech setup, and team contacts.</p>
                  </div>
                </div>
                <button onClick={() => navigate('/templates/new')}
                  className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl border border-green-100 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Custom Template
                </button>
              </div>
              <div className="flex items-center gap-2 mb-5 px-1">
                <span className="text-xs text-gray-400">Showing templates for</span>
                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">{form.department}</span>
              </div>
              <div className="space-y-3">
                {currentTemplates.map(t => {
                  const Icon = t.icon;
                  const selected = template === t.id;
                  return (
                    <button key={t.id} onClick={() => setTemplate(t.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left w-full transition-all ${
                        selected ? 'border-green-400 bg-green-50/60 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
                      }`}>
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">{t.label}</p>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.taskCount} tasks</span>
                        </div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {t.focus.map(f => <span key={f} className="text-xs text-gray-500">{f}</span>)}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                        {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!step2Valid}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors shadow-sm">
                  Next: Review & Generate <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {!generating ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Ready to Generate Roadmap</h2>
                    <p className="text-gray-500 text-sm">Roadmap + team contacts will be auto-populated based on the selected template.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'New Hire', value: form.name },
                      { label: 'Role Title', value: form.roleTitle },
                      { label: 'Department', value: form.department },
                      { label: 'Start Date', value: form.startDate ? new Date(form.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—' },
                      { label: 'Work Mode', value: WORK_MODES.find(m => m.value === form.workMode)?.label || '' },
                      { label: 'Template', value: ALL_TEMPLATES_MERGED.find(t => t.id === template)?.label || '' },
                      { label: 'Duration', value: `${form.onboardingDuration} weeks` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-green-600 font-medium">{item.label}</p>
                        <p className="text-gray-800 font-medium mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Roadmap Preview</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PREVIEW_WEEKS.map(w => (
                      <div key={w.week} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs font-semibold text-green-700 mb-2">{w.week}</p>
                        <ul className="space-y-1">
                          {w.tasks.map(t => (
                            <li key={t} className="text-xs text-gray-500 flex items-start gap-1">
                              <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleGenerate}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-200">
                    <Sparkles className="w-4 h-4" /> Generate Roadmap
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                  <h2 className="text-gray-900 mb-1">Generating Roadmap…</h2>
                  <p className="text-gray-500 text-sm">Building week-by-week milestone plan for {form.name}</p>
                </div>
                <div className="space-y-3">
                  {PREVIEW_WEEKS.map((w, i) => (
                    <motion.div key={w.week} initial={{ opacity: 0, x: -20 }} animate={generatedWeeks.includes(i) ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4 }}>
                      {generatedWeeks.includes(i) ? (
                        <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-800">{w.week} — {w.tasks.length} tasks generated</p>
                            <p className="text-xs text-green-600">{w.tasks.join(' · ')}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-40">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          <p className="text-sm text-gray-400">{w.week} — pending…</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}