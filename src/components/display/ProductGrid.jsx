import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, viewMode }) {
  // تحديد كلاسات الـ Grid المناسبة بناءً على الـ viewMode
  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'grid-cols-1 gap-y-8';
      case 'grid-2':
        return 'grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10';
      case 'grid-3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10';
      case 'grid-4':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10';
    }
  };

  return (
    <div className={`grid ${getGridClasses()} transition-all duration-300`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}