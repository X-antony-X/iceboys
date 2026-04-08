import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

export default function SidebarFilters({ onFilterChange, isMobile }) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isApplied, setIsApplied] = useState(false);

  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  const toggleSize = (size) => {
    const updated = selectedSizes.includes(size) 
      ? selectedSizes.filter(s => s !== size) 
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    // تحديث فوري للمقاسات
    onFilterChange({ priceRange, selectedSizes: updated });
  };

  const handleApplyPrice = () => {
    setIsApplied(true);
    onFilterChange({ priceRange, selectedSizes });
  };

  const clearAll = () => {
    const defaultPrice = { min: 0, max: 1500 };
    setPriceRange(defaultPrice);
    setSelectedSizes([]);
    setIsApplied(false);
    onFilterChange({ priceRange: defaultPrice, selectedSizes: [] });
  };

  return (
    <div className={`w-full bg-white p-6 ${!isMobile ? 'border border-gray-100 rounded-sm' : ''}`}>
      
      {/* 1. قسم REFINED BY */}
      {(isApplied || selectedSizes.length > 0) && (
        <div className="mb-10 pb-6 border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2d2d2d]">Active Filters</h4>
            <button onClick={clearAll} className="text-[10px] font-bold text-red-500 uppercase hover:underline transition-all">Clear All</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {isApplied && (
              <span className="inline-flex items-center gap-2 bg-[#f8f9fa] border border-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-600 rounded-sm">
                LE {priceRange.min} - {priceRange.max}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setIsApplied(false)} />
              </span>
            )}
            {selectedSizes.map(size => (
              <span key={size} className="inline-flex items-center gap-2 bg-[#004b93]/5 border border-[#004b93]/10 px-3 py-1.5 text-[10px] font-bold text-[#004b93] rounded-sm">
                SIZE: {size}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleSize(size)} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. فلتر المقاسات */}
      <div className="mb-12">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2d2d2d] mb-6 flex items-center justify-between">
          Select Size <ChevronRight size={14} className="text-gray-300" />
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`py-2.5 text-[11px] font-bold border transition-all duration-300 rounded-sm ${
                selectedSizes.includes(size)
                ? 'bg-[#004b93] border-[#004b93] text-white shadow-lg shadow-[#004b93]/20'
                : 'bg-white border-gray-200 text-gray-500 hover:border-[#004b93] hover:text-[#004b93]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 3. فلتر السعر */}
      <div className="mb-6">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2d2d2d] mb-8 flex items-center justify-between">
          Price Range <ChevronRight size={14} className="text-gray-300" />
        </h4>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <input 
              type="number" 
              value={priceRange.min}
              placeholder="From"
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className="w-full border-b border-gray-200 py-2 text-sm font-bold outline-none focus:border-[#004b93] transition-colors"
            />
            <span className="absolute right-0 top-2 text-[10px] text-gray-300 font-bold">MIN</span>
          </div>
          <div className="relative flex-1">
            <input 
              type="number" 
              value={priceRange.max}
              placeholder="To"
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className="w-full border-b border-gray-200 py-2 text-sm font-bold outline-none focus:border-[#004b93] transition-colors"
            />
            <span className="absolute right-0 top-2 text-[10px] text-gray-300 font-bold">MAX</span>
          </div>
        </div>

        <button 
          onClick={handleApplyPrice}
          className="w-full bg-[#004b93] text-white py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-[#2d2d2d] transition-all rounded-sm shadow-xl shadow-blue-900/10 active:scale-95"
        >
          Apply Filters
        </button>
      </div>

    </div>
  );
}