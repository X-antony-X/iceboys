import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, viewMode }) {
  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'grid-cols-1 gap-y-6 md:gap-y-8';
      case 'grid-2':
        return 'grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-10';
      case 'grid-3':
        // في الموبايل 2، وفي الشاشات المتوسطة 3
        return 'grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-10';
      case 'grid-4':
        // في الموبايل 2، التابلت 3، اللاب توب 4
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-4 md:gap-y-10';
      default:
        return 'grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-10';
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