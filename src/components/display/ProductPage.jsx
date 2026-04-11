import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';
import Toolbar from './Toolbar';
import ProductGrid from './ProductGrid';
import SidebarFilters from './SidebarFilters';

const fetchSupabaseProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false }); // ترتيب من الأحدث للأقدم
  if (error) throw new Error(error.message);
  return data;
};

export default function ProductPage() {
  const { category: urlSlug } = useParams();
  const [viewMode, setViewMode] = useState('grid-3');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchSupabaseProducts,
  });

  // تحديد هل إحنا في صفحة المضاف حديثاً ولا لأ
  const isNewArrivals = urlSlug === 'new-arrivals';

  // دالة تنظيف الكلمات (تحويل لصغير، حذف العلامات، وحذف حرف s الجمع للتبسيط)
  const cleanWord = (word) => {
    if (!word) return '';
    let w = word.toLowerCase().replace('collection', '').trim();
    if (w.endsWith('s')) w = w.slice(0, -1); // تحويل hoodies لـ hoodie
    return w;
  };

  useEffect(() => {
    if (allProducts) {
      // لو إحنا في New Arrivals، نعرض كل المنتجات فوراً ونوقف الفلترة بالكلمات
      if (isNewArrivals) {
        setFilteredProducts(allProducts);
        return;
      }

      // الفلترة العادية لباقي الأقسام
      const slugWords = (urlSlug || '')
        .split('-')
        .map(w => cleanWord(w))
        .filter(w => w !== '' && w !== 'shop');

      const result = allProducts.filter(product => {
        if (slugWords.length === 0) return true;

        const productInfo = `${cleanWord(product.collection)} ${cleanWord(product.category)}`;
        return slugWords.every(word => productInfo.includes(word));
      });
      
      setFilteredProducts(result);
    }
  }, [urlSlug, allProducts, isNewArrivals]);

  // دالة الفلترة الجانبية (Sidebar)
  const handleFilterChange = (filters) => {
    if (!allProducts) return;
    const { priceRange, selectedSizes } = filters;

    let result = allProducts.filter(product => {
        // 1. فلتر الرابط (لو مش في صفحة New Arrivals)
        if (!isNewArrivals) {
            const slugWords = (urlSlug || '').split('-').map(w => cleanWord(w)).filter(w => w !== '' && w !== 'shop');
            if (slugWords.length > 0) {
                const productInfo = `${cleanWord(product.collection)} ${cleanWord(product.category)}`;
                if (!slugWords.every(word => productInfo.includes(word))) return false;
            }
        }

        // 2. فلتر السعر
        if (priceRange && (product.price < priceRange.min || product.price > priceRange.max)) return false;

        // 3. فلتر المقاسات
        if (selectedSizes?.length > 0) {
            const hasSize = product.sizes?.some(s => selectedSizes.includes(s.size));
            if (!hasSize) return false;
        }

        return true;
    });

    setFilteredProducts(result);
  };

  if (isLoading) return <div className="text-center py-20 font-black text-[#004b93] animate-pulse">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#004b93] uppercase italic">
            {isNewArrivals ? 'New Arrivals' : (urlSlug ? urlSlug.replace(/-/g, ' ') : 'All Products')}
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-[280px] sticky top-28 h-fit">
            <SidebarFilters onFilterChange={handleFilterChange} />
          </aside>

          <main className="flex-1">
            <Toolbar viewMode={viewMode} setViewMode={setViewMode} total={filteredProducts.length} />
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} viewMode={viewMode} />
            ) : (
              <div className="text-center py-40 border border-dashed border-gray-200">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-gray-400 font-black uppercase tracking-widest">No Products Found</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}