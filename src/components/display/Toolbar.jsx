import React from 'react';
import { LayoutList, LayoutGrid, Grid3X3, Grid2X2, ChevronDown, SortAsc, Layers } from 'lucide-react';

export default function Toolbar({ viewMode, setViewMode }) {
  const views = [
    { id: 'list', icon: <LayoutList size={16} />, label: 'List' },
    { id: 'grid-2', icon: <LayoutGrid size={16} />, label: 'Grid 2' },
    { id: 'grid-3', icon: <Grid2X2 size={16} />, label: 'Grid 3' },
    { id: 'grid-4', icon: <Grid3X3 size={16} />, label: 'Grid 4' }
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        
        {/* الجزء الأيسر: التحكم في شكل العرض */}
        <div className="flex items-center justify-between px-5 py-4 lg:py-0 bg-[#f8f9fa]/50 lg:bg-transparent min-w-fit">
          <div className="flex items-center gap-2 mr-6">
            <Layers size={14} className="text-[#004b93]" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 whitespace-nowrap">
              View Mode
            </span>
          </div>

          {/* Segmented Control Buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id)}
                className={`flex items-center justify-center p-2 rounded-md transition-all duration-300 ${
                  viewMode === view.id 
                    ? 'bg-[#004b93] text-white shadow-sm scale-105' 
                    : 'text-gray-400 hover:text-[#004b93] hover:bg-white'
                } ${view.id === 'grid-4' || view.id === 'grid-3' ? 'hidden sm:flex' : 'flex'}`}
                title={view.label}
              >
                {view.icon}
              </button>
            ))}
          </div>
        </div>

        {/* الجزء الأيمن: الفلترة والترتيب */}
        <div className="flex-1 grid grid-cols-2 lg:flex items-center gap-0 divide-x divide-gray-100">
          
          {/* Items Per Page */}
          <div className="relative group flex items-center px-4 py-4 w-full lg:max-w-[180px]">
            <select className="appearance-none bg-transparent w-full text-[11px] font-bold text-gray-600 uppercase tracking-wider outline-none cursor-pointer z-10 pl-2">
              <option value="15">Show 15</option>
              <option value="30">Show 30</option>
              <option value="50">Show 50</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 text-gray-300 group-hover:text-[#004b93] transition-colors" />
          </div>

          {/* Sort By */}
          <div className="relative group flex items-center px-4 py-4 w-full">
            <div className="hidden sm:flex items-center gap-2 mr-3 text-gray-400">
              <SortAsc size={14} />
            </div>
            <select className="appearance-none bg-transparent w-full text-[11px] font-bold text-gray-600 uppercase tracking-wider outline-none cursor-pointer z-10">
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 text-gray-300 group-hover:text-[#004b93] transition-colors" />
          </div>

        </div>
      </div>
    </div>
  );
}