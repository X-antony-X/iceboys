import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // مهم جداً
import Toolbar from './Toolbar';
import ProductGrid from './ProductGrid';
import { products } from './Products'; // تأكد إن كل منتج عنده خاصية category

export default function ProductPage() {
  const { category } = useParams(); // بيسحب اسم القسم من الـ URL
  const [viewMode, setViewMode] = useState('grid-3');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (category) {
      // فلترة المنتجات بناءً على الـ category المبعوث
      const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // لو مفيش category اعرض كله
    }
  }, [category]); // يشتغل كل ما الـ category يتغير

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* العنوان بيتغير ديناميكياً */}
        <h1 className="text-3xl font-bold text-center text-[#004b93] mb-10 uppercase tracking-widest italic">
          {category ? `${category} Collection` : 'All Collections'}
        </h1>

        <Toolbar viewMode={viewMode} setViewMode={setViewMode} />
        
        {/* لو القسم فاضي اعرض رسالة */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} viewMode={viewMode} />
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold">
            No products found in this category.
          </div>
        )}

      </div>
    </div>
  );
}