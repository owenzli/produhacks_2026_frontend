import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, CheckCircle2, Wand2, Hexagon, Star, Crown, Zap, Save, Trash2 } from 'lucide-react';
import { useApp, CustomTemplate, CustomTemplateTask, Week } from '../context/AppContext';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Data', 'Platform', 'QA', 'Security'];

const ICONS = [
  { name: 'Star', icon: Star },
  { name: 'Crown', icon: Crown },
  { name: 'Hexagon', icon: Hexagon },
  { name: 'Zap', icon: Zap },
];

const COLORS = [
  'from-pink-500 to-rose-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-indigo-600',
  'from-teal-500 to-gray-900',
];

export default function TemplateBuilder() {
  const navigate = useNavigate();
  const { addCustomTemplate } = useApp();

  const [label, setLabel] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [iconName, setIconName] = useState('Star');
  const [color, setColor] = useState(COLORS[0]);
  
  const [tasks, setTasks] = useState<CustomTemplateTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Onboarding');
  const [newTaskWeek, setNewTaskWeek] = useState<Week>(1);
  const [newTaskIsTech, setNewTaskIsTech] = useState(false);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, {
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      week: newTaskWeek,
      isTechnicalSetup: newTaskIsTech
    }]);
    setNewTaskTitle('');
  };

  const handleSave = () => {
    if (!label.trim() || tasks.length === 0) return;
    const id = `custom-${Date.now()}`;
    addCustomTemplate({
      id,
      label,
      department,
      iconName,
      color,
      tasks,
    });
    navigate('/roadmap'); // Usually would go to a template management list, but this works for demo
  };

  const SelectedIcon = ICONS.find(i => i.name === iconName)?.icon || Star;

  return (
    <div className="min-h-full bg-gray-50/50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white border border-gray-200 rounded-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Builder</h1>
              <p className="text-sm text-gray-500">Design custom onboarding paths for unique roles.</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!label.trim() || tasks.length === 0}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black disabled:opacity-50 text-white px-5 py-2.5 rounded-sm transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Template
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Identity</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Name</label>
                  <input
                    type="text"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    placeholder="e.g. Motion Designer"
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visual Theme</label>
                  <div className="flex gap-2 mb-3">
                    {ICONS.map(i => {
                      const Icon = i.icon;
                      return (
                        <button
                          key={i.name}
                          onClick={() => setIconName(i.name)}
                          className={`w-10 h-10 rounded-sm flex items-center justify-center border transition-all ${iconName === i.name ? 'border-green-500 bg-gray-50 text-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-sm bg-gradient-to-br ${c} border-2 transition-transform ${color === c ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Preview Card</h3>
              <div className={`flex items-center gap-4 p-4 rounded-sm border border-gray-100 shadow-sm`}>
                <div className={`w-11 h-11 rounded-sm bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <SelectedIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{label || 'Role Title'}</p>
                  <span className="text-xs text-gray-500">{tasks.length} tasks</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Tasks</h2>
              
              <div className="flex gap-3 items-end mb-6 p-4 bg-gray-50 rounded-sm border border-gray-100">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                    placeholder="e.g. Access Figma Workspace"
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  >
                    <option>Onboarding</option>
                    <option>Setup</option>
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Product</option>
                    <option>Milestone</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Week</label>
                  <select
                    value={newTaskWeek}
                    onChange={e => setNewTaskWeek(Number(e.target.value) as Week)}
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  >
                    <option value={1}>Week 1</option>
                    <option value={2}>Week 2</option>
                    <option value={3}>Week 3</option>
                    <option value={4}>Week 4+</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5 pb-2 ml-1">
                  <input
                    type="checkbox"
                    checked={newTaskIsTech}
                    onChange={e => setNewTaskIsTech(e.target.checked)}
                    className="w-4 h-4 text-gray-900 focus:ring-gray-1000 border-gray-300 rounded"
                    id="tech-setup"
                  />
                  <label htmlFor="tech-setup" className="text-xs font-medium text-gray-600 cursor-pointer">Tech Setup?</label>
                </div>
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="bg-gray-900 hover:bg-black disabled:opacity-50 text-white rounded-sm p-2 transition-colors focus:ring-2 focus:ring-green-400"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-sm">
                  <Wand2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No tasks added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add tasks above to define this role's roadmap</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(week => {
                    const weekTasks = tasks.filter(t => t.week === week);
                    if (weekTasks.length === 0) return null;
                    return (
                      <div key={week}>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Week {week}</h4>
                        <ul className="space-y-2">
                          {weekTasks.map((t, idx) => (
                            <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-sm group">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{t.title}</p>
                                  <div className="flex gap-2 mt-0.5">
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">{t.category}</span>
                                    {t.isTechnicalSetup && (
                                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Tech Setup</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setTasks(tasks.filter(task => task !== t))}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-sm transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
