import React from 'react';
import { LayoutList, LayoutGrid, Grid3X3, Grid2X2, ChevronDown } from 'lucide-react';

export default function Toolbar({ viewMode, setViewMode }) {
  const views = [
    { id: 'list', icon: <LayoutList size={18} /> },
    { id: 'grid-2', icon: <LayoutGrid size={18} /> },
    { id: 'grid-3', icon: <Grid2X2 size={18} /> },
    { id: 'grid-4', icon: <Grid3X3 size={18} /> }
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between bg-[#f8f9fa] p-4 md:px-6 mb-8 border border-gray-100 shadow-sm rounded-sm">
      
      {/* الجزء الأيسر: View As */}
      <div className="flex items-center justify-between w-full lg:w-auto border-b border-gray-200 lg:border-none pb-4 lg:pb-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">
          View As
        </span>
        <div className="flex items-center gap-2">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id)}
              className={`p-2 transition-all duration-300 rounded-sm border ${
                viewMode === view.id 
                ? 'bg-[#004b93] border-[#004b93] text-white shadow-md' 
                : 'bg-white border-gray-200 text-gray-400 hover:border-[#004b93] hover:text-[#004b93]'
              } ${view.id === 'grid-4' || view.id === 'grid-3' ? 'hidden md:flex' : 'flex'}`}
            >
              {view.icon}
            </button>
          ))}
        </div>
      </div>

      {/* الجزء الأيمن: Selects (بتكون جنب بعض في الموبايل عشان توفر مساحة) */}
      <div className="grid grid-cols-2 lg:flex w-full lg:w-auto gap-3 pt-4 lg:pt-0">
        
        {/* Items Per Page */}
        <div className="relative group w-full">
          <select className="appearance-none border border-gray-200 bg-white pl-3 pr-8 py-2.5 text-[11px] md:text-sm font-medium text-gray-700 outline-none focus:border-[#004b93] w-full cursor-pointer rounded-sm">
            <option value="15">Show 15</option>
            <option value="30">Show 30</option>
            <option value="50">Show 50</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>

        {/* Sort By */}
        <div className="relative group w-full">
          <select className="appearance-none border border-gray-200 bg-white pl-3 pr-8 py-2.5 text-[11px] md:text-sm font-medium text-gray-700 outline-none focus:border-[#004b93] w-full cursor-pointer rounded-sm">
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>

      </div>
    </div>
  );
}