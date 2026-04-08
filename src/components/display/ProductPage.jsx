import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Toolbar from './Toolbar';
import ProductGrid from './ProductGrid';
import SidebarFilters from './SidebarFilters';
import { products } from './Products';

export default function ProductPage() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState('grid-3');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (filters) => {
    const { priceRange, selectedSizes } = filters;
    let result = products;
    
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (priceRange) {
      result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    }
    if (selectedSizes?.length > 0) {
      result = result.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }
    setFilteredProducts(result);
  };

  useEffect(() => {
    handleFilterChange({ priceRange: { min: 0, max: 2000 }, selectedSizes: [] });
  }, [category]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-[#2d2d2d]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-12">
        
        {/* هيدر الصفحة - Breadcrumbs & Title */}
        <header className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Home / Shop</p>
          <h1 className="text-3xl md:text-5xl font-black text-[#004b93] uppercase tracking-tighter italic italic-shadow">
            {category ? category : 'All Collections'}
          </h1>
          <div className="w-20 h-1 bg-[#004b93] mx-auto mt-4"></div>
        </header>

        {/* Control Bar - Toolbar & Mobile Filter */}
        <div className="sticky top-0 z-40 bg-[#fcfcfc]/80 backdrop-blur-md py-4 mb-8 border-b border-gray-100 lg:border-none lg:relative lg:p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-3 bg-[#2d2d2d] text-white px-6 py-3 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#004b93] transition-all"
            >
              <SlidersHorizontal size={14} />
              Filter & Refine
            </button>
            <div className="flex-1">
              <Toolbar viewMode={viewMode} setViewMode={setViewMode} total={filteredProducts.length} />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0 sticky top-28 h-fit">
            <SidebarFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Mobile Drawer */}
          <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMobileFilterOpen ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileFilterOpen(false)} />
            <div className={`absolute left-0 top-0 h-full w-[300px] bg-white transition-transform duration-500 ease-out shadow-2xl ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#004b93] text-white">
                <span className="font-black uppercase tracking-widest text-sm">Filters</span>
                <X size={20} className="cursor-pointer" onClick={() => setIsMobileFilterOpen(false)} />
              </div>
              <div className="p-2 overflow-y-auto h-[calc(100%-70px)]">
                <SidebarFilters onFilterChange={handleFilterChange} isMobile={true} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} viewMode={viewMode} />
            ) : (
              <div className="text-center py-40 bg-white border border-dashed border-gray-200 rounded-sm">
                <div className="mb-4 text-gray-300">
                  <SlidersHorizontal size={48} className="mx-auto opacity-20" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">No results found</h3>
                <button onClick={() => window.location.reload()} className="mt-4 text-[#004b93] text-[10px] font-black uppercase underline">Reset All</button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}