import { Filter, ArrowUpDown } from 'lucide-react';
import { Task } from '../../context/AppContext';
import { FilterKey, SortKey, FILTER_OPTIONS, SORT_OPTIONS } from './constants';

export function FilterBar({
  tasks, activeFilter, setActiveFilter, sortBy, setSortBy,
}: {
  tasks: Task[];
  activeFilter: FilterKey;
  setActiveFilter: (k: FilterKey) => void;
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Filter</span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {FILTER_OPTIONS.map(opt => {
            const count = opt.count(tasks);
            const active = activeFilter === opt.key;
            const Icon = opt.icon;
            return (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                disabled={count === 0 && opt.key !== 'all'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-medium transition-all flex-shrink-0 ${
                  active ? opt.activeColor : opt.color
                } ${count === 0 && opt.key !== 'all' ? 'opacity-40 cursor-default' : ''}`}
              >
                <Icon className="w-3 h-3" />
                {opt.label}
                <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold ${active ? 'bg-white/20' : 'bg-black/[0.07]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0 border-l border-gray-100 pl-4">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Sort</span>
          <div className="flex gap-1.5">
            {SORT_OPTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  sortBy === s.key ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
