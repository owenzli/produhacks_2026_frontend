import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  Wand2, Map, Users, ChevronRight, Bell, Search,
  CheckCircle2, Settings, HelpCircle, Plus, ChevronDown,
  UserCircle2, PanelLeftClose, PanelLeftOpen, Building2,
  Pencil, Eye, LayoutList
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ManagerSettingsModal } from './ManagerSettingsModal';
import { motion, AnimatePresence } from 'motion/react';

const setupNavItems = [
  { to: '/', end: true, icon: Wand2, label: 'Onboarding Wizard', sublabel: 'New hire setup' },
  { to: '/roadmap', end: false, icon: Map, label: 'Roadmap Review', sublabel: 'Edit & approve plan' },
  { to: '/new-hire', end: false, icon: Users, label: 'New Hire View', sublabel: 'Assignee checklist' },
];

const activeNavItems = [
  { to: '/roadmap', end: false, icon: LayoutList, label: 'Edit Plan', sublabel: 'Tasks & roadmap' },
  { to: '/new-hire', end: false, icon: Eye, label: 'New Hire View', sublabel: 'Assignee checklist' },
];

export default function Layout() {
  const navigate = useNavigate();
  const { hires, activeHireId, setActiveHireId, hireInfo, roadmapGenerated, launched, tasks, managerProfile } = useApp();
  const docDebtCount = tasks.filter(t => !t.linkedDoc && !t.docDebtResolved).length;
  const [hireSwitcherOpen, setHireSwitcherOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleSwitchHire(id: string) {
    setActiveHireId(id);
    setHireSwitcherOpen(false);
    navigate('/roadmap');
  }

  function handleAddNewHire() {
    setHireSwitcherOpen(false);
    navigate('/');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-grid">
      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: navCollapsed ? 64 : 256 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="flex-shrink-0 bg-[#0c0c0e] border-r border-white/[0.06] flex flex-col z-10 overflow-hidden"
      >
        {/* Brand header */}
        <div className="px-[18px] py-[14px] flex-shrink-0 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence initial={false}>
              {!navCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <p className="text-white font-semibold tracking-tight text-sm">LaunchPath</p>
                  <p className="text-white/40 text-xs font-mono-label">Manager Console</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hire Switcher */}
        <AnimatePresence initial={false}>
          {!navCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden flex-shrink-0"
            >
              <div className="px-3 pt-3 pb-1">
                <p className="text-gray-400 text-xs px-2 mb-1.5 uppercase tracking-wider">Active Hire</p>
                <button
                  onClick={() => setHireSwitcherOpen(v => !v)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 border transition-all text-left ${
                    hireSwitcherOpen
                      ? 'bg-white/[0.08] border-white/[0.12]'
                      : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12]'
                  }`}
                >
                  {hireInfo ? (
                    <>
                      <div className="w-7 h-7 bg-white/10 flex items-center justify-center flex-shrink-0 text-white text-xs font-mono font-semibold">
                        {hireInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{hireInfo.name}</p>
                        <p className="text-xs text-white/40 font-mono truncate">{hireInfo.roleTitle}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-7 h-7 bg-white/10 flex items-center justify-center flex-shrink-0">
                        <UserCircle2 className="w-4 h-4 text-white/40" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/40">No hire selected</p>
                      </div>
                    </>
                  )}
                  <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${hireSwitcherOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {hireSwitcherOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 bg-[#161618] border border-white/10 overflow-hidden">
                        {hires.length > 0 && (
                          <div className="p-1">
                            {hires.map(h => (
                              <button
                                key={h.id}
                                onClick={() => handleSwitchHire(h.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                                  h.id === activeHireId ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'
                                }`}
                              >
                                <div className="w-6 h-6 bg-white/10 flex items-center justify-center flex-shrink-0 text-white text-xs font-mono font-semibold">
                                  {h.info.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{h.info.name}</p>
                                  <p className="text-xs text-white/40 font-mono truncate">{h.info.roleTitle}</p>
                                </div>
                                {h.id === activeHireId && (
                                  <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                )}
                                {h.launched && h.id !== activeHireId && (
                                  <span className="text-xs bg-indigo-600/20 text-indigo-300 px-1.5 py-0.5 font-mono-label flex-shrink-0">Live</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="border-t border-white/[0.06] p-1">
                          <button
                            onClick={handleAddNewHire}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/[0.06] transition-colors"
                          >
                            <div className="w-6 h-6 bg-white/10 flex items-center justify-center flex-shrink-0">
                              <Plus className="w-3.5 h-3.5 text-white/60" />
                            </div>
                            <span className="text-sm font-medium text-white/60">Add New Hire</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {roadmapGenerated ? (
              <motion.div
                key="active-nav"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-1"
              >
                {!navCollapsed && (
                  <div className="flex items-center justify-between px-2 mb-2">
                    <p className="font-mono-label text-white/30">Manage Hire</p>
                    {launched && (
                      <span className="flex items-center gap-1 font-mono-label text-indigo-400 bg-indigo-600/10 px-1.5 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    )}
                  </div>
                )}


                {activeNavItems.map(({ to, end, icon: Icon, label, sublabel }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    title={navCollapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 transition-all group relative ${
                        navCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
                      } ${
                        isActive
                          ? 'bg-white/[0.08] text-white'
                          : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />}
                        <div className={`flex items-center justify-center flex-shrink-0 transition-colors ${
                          navCollapsed ? 'w-9 h-9' : 'w-7 h-7'
                        } ${
                          isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <AnimatePresence initial={false}>
                          {!navCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex-1 min-w-0 overflow-hidden"
                            >
                              <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-white/60'}`}>{label}</p>
                              <p className={`text-xs truncate font-mono-label ${isActive ? 'text-white/50' : 'text-white/25'}`}>{sublabel}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {!navCollapsed && isActive && <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />}
                      </>
                    )}
                  </NavLink>
                ))}

                {/* Status summary */}
                <AnimatePresence initial={false}>
                  {!navCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-white/[0.06]">
                        <p className="font-mono-label text-white/25 px-2 mb-2">Plan Status</p>
                        <div className="px-2 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">Tasks</span>
                            <span className="text-xs font-mono font-medium text-white/60">{tasks.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">Hires</span>
                            <span className="text-xs font-mono font-medium text-white/60">{hires.length}</span>
                          </div>
                          {docDebtCount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-amber-400/80">Doc Debt</span>
                              <span className="text-xs font-mono font-semibold text-amber-300">{docDebtCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed doc debt badge */}
                {navCollapsed && docDebtCount > 0 && (
                  <div className="flex justify-center pt-1">
                    <span className="bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold w-6 h-6 flex items-center justify-center">
                      {docDebtCount}
                    </span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="setup-nav"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-1"
              >
                {!navCollapsed && (
                  <p className="font-mono-label text-white/30 px-2 mb-2">Setup</p>
                )}
                {setupNavItems.map(({ to, end, icon: Icon, label, sublabel }, idx) => {
                  const stepNum = idx + 1;
                  const isLocked = (idx === 1 && !roadmapGenerated) || (idx === 2 && !launched);
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      title={navCollapsed ? label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-3 transition-all group relative ${
                          navCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'
                        } ${
                          isLocked
                            ? 'opacity-25 pointer-events-none'
                            : isActive
                            ? 'bg-white/[0.08] text-white'
                            : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />}
                          <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold transition-colors ${
                            isActive ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/20 text-white/30 group-hover:border-white/40'
                          }`}>
                            {stepNum}
                          </div>
                          <AnimatePresence initial={false}>
                            {!navCollapsed && (
                              <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex-1 min-w-0 overflow-hidden"
                              >
                                <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>{label}</p>
                                <p className={`text-xs truncate font-mono-label ${isActive ? 'text-white/40' : 'text-white/20'}`}>{sublabel}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Footer */}
        <div className="px-2 py-2 border-t border-white/[0.06] flex-shrink-0 space-y-0.5">
          {/* Collapse toggle */}
          <button
            onClick={() => setNavCollapsed(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white/60"
            title={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {navCollapsed
              ? <PanelLeftOpen className="w-4 h-4 flex-shrink-0 mx-auto" />
              : (
                <>
                  <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium">Collapse sidebar</span>
                </>
              )
            }
          </button>

          {/* Profile */}
          <div onClick={() => setSettingsOpen(true)} className={`flex items-center gap-3 px-3 py-2 hover:bg-white/[0.06] cursor-pointer transition-colors ${navCollapsed ? 'justify-center' : ''}`}>
            <div className="w-6 h-6 bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white/80 text-xs font-mono font-semibold">{managerProfile?.name?.charAt(0).toUpperCase() || 'M'}</span>
            </div>
            <AnimatePresence initial={false}>
              {!navCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0 overflow-hidden flex items-center gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">{managerProfile?.name || 'Loading...'}</p>
                    <p className="text-xs text-white/30 font-mono truncate">{managerProfile?.role || 'Manager'}</p>
                  </div>
                  <Settings className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-4 flex-shrink-0">
          <div className="flex-1 flex items-center gap-3 max-w-md">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks, team members…"
                className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none flex-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-sm hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              {docDebtCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-sm" />
              )}
            </button>
            <button onClick={() => navigate('/help')} className="p-2 rounded-sm hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-sm">
              <Building2 className="w-4 h-4 text-gray-900 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900">Product Management Company</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative min-h-full">
            {/* LaunchPath dotted-line background decoration */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 1100 850"
              aria-hidden="true"
            ><path></path><path></path>{/* Primary winding launch path — hugs bottom & right edges */}<path></path><path></path><path
                d="M -60 900 C 40 800, 20 650, 140 580 C 260 510, 340 440, 420 470 C 500 500, 480 600, 600 560 C 720 520, 760 380, 920 340 C 1020 315, 1080 200, 1160 80"
                fill="none"
                stroke="#16a34a"
                strokeWidth="1.5"
                strokeDasharray="6 16"
                strokeLinecap="round"
                opacity="0.07"
              /><circle></circle>{/* Secondary arc — hugs top-left corner area */}<circle></circle><circle></circle><path
                d="M -100 200 C 20 140, 80 60, 200 40 C 320 20, 380 80, 440 60 C 500 40, 520 -20, 640 -40"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="5 13"
                strokeLinecap="round"
                opacity="0.06"
              /><circle></circle>{/* Right-edge looping accent */}<circle></circle><circle></circle><path
                d="M 980 -30 C 1040 60, 1080 180, 1020 280 C 960 380, 880 360, 900 460 C 920 560, 1040 580, 1060 680 C 1080 780, 1020 860, 1060 940"
                fill="none"
                stroke="#16a34a"
                strokeWidth="1.5"
                strokeDasharray="4 12"
                strokeLinecap="round"
                opacity="0.06"
              />{/* Bottom-right subtle sweep */}<path
                d="M 500 900 C 620 840, 700 780, 820 760 C 940 740, 1020 800, 1120 780"
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="4 11"
                strokeLinecap="round"
                opacity="0.06"
              />{/* Waypoints — kept near edges, very faint */}<circle cx="140" cy="580" r="4" fill="#16a34a" opacity="0.09" /><circle cx="140" cy="580" r="10" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.05" /><circle cx="920" cy="340" r="4" fill="#16a34a" opacity="0.09" /><circle cx="920" cy="340" r="10" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.05" /><circle cx="200" cy="40" r="3" fill="#10b981" opacity="0.08" /><circle cx="1020" cy="280" r="3" fill="#16a34a" opacity="0.08" /></svg>
            <Outlet />
          </div>
        </div>
      </main>

      <ManagerSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}