import React, { useRef } from 'react';

const sectionsData = [
  {
    id: 'jackets',
    title: 'JACKETS',
    products: [
      { 
        id: 1, 
        name: 'Puffer Jacket Black', 
        price: 'LE 850.00', 
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        sizes: ['S', 'M', 'L', 'XL']
      },
      { 
        id: 2, 
        name: 'Bomber Jacket Blue', 
        price: 'LE 750.00', 
        image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=500',
        sizes: ['M', 'L', 'XXL']
      },
      { 
        id: 3, 
        name: 'Windbreaker Grey', 
        price: 'LE 600.00', 
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d395?w=500',
        sizes: ['S', 'M', 'L', 'XL']
      },
      { 
        id: 4, 
        name: 'Leather Jacket Slim', 
        price: 'LE 1200.00', 
        image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
        sizes: ['L', 'XL']
      },
      { 
        id: 5, 
        name: 'Windbreaker Grey', 
        price: 'LE 600.00', 
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d395?w=500',
        sizes: ['S', 'M', 'L', 'XL']
      },
      { 
        id: 6, 
        name: 'Leather Jacket Slim', 
        price: 'LE 1200.00', 
        image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
        sizes: ['L', 'XL']
      },
    ]
  },
  {
    id: 't-shirts',
    title: 'BASIC T-SHIRTS',
    products: [
      { 
        id: 5, 
        name: 'Basic T-Shirt White', 
        price: 'LE 250.00', 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
      },
      { 
        id: 6, 
        name: 'Oversized Tee Gray', 
        price: 'LE 300.00', 
        image: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
        sizes: ['M', 'L', 'XL']
      },
      { 
        id: 7, 
        name: 'Graphic Tee Blue', 
        price: 'LE 350.00', 
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
        sizes: ['S', 'M']
      },
      { 
        id: 8, 
        name: 'Polo Shirt Navy', 
        price: 'LE 400.00', 
        image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500',
        hoverImage: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
        sizes: ['M', 'L', 'XL']
      },
    ]
  }
];
const ProductSection = ({ title, products }) => {
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // الـ return هنا لازم يكون جوه الـ ProductSection
  return (
    <div className="mb-16 relative group/section">
      {/* خط العنوان الجانبي */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow h-[1px] bg-gray-300"></div>
        <h2 className="px-6 text-xl md:text-2xl font-black italic tracking-tighter text-[#004b93] uppercase">
          {title}
        </h2>
        <div className="flex-grow h-[1px] bg-gray-300"></div>
      </div>

      {/* أزرار الأسهم */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-100 items-center justify-center rounded-full shadow-lg opacity-0 group-hover/section:opacity-100 transition-all hover:bg-[#004b93] hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm border border-gray-100 items-center justify-center rounded-full shadow-lg opacity-0 group-hover/section:opacity-100 transition-all hover:bg-[#004b93] hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* حاوية التقليب (Slider) */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer flex-none w-[65%] sm:w-[45%] md:w-[23%] snap-start">
            <div className="aspect-[3/4] overflow-hidden bg-[#f8f9fa] mb-4 relative rounded-sm">
              {/* الصور */}
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0" />
              <img src={product.hoverImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100" />
              
              {/* زرار القلب */}
              <button className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 bg-white flex items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-[#004b93] text-gray-400 z-10 translate-y-[-10px] group-hover:translate-y-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* المقاسات */}
              <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 py-3 px-2 flex justify-center items-center gap-2 border-t border-gray-100">
                {product.sizes.map((size, index) => (
                  <span key={index} className="text-[11px] font-bold text-[#2d2d2d] hover:text-[#004b93] transition-transform cursor-pointer">{size}</span>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left px-1">
              <h3 className="text-[12px] md:text-sm font-bold text-[#2d2d2d] mb-1 uppercase truncate">{product.name}</h3>
              <p className="text-[13px] md:text-sm font-bold text-gray-500">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* زرار عرض المزيد */}
      <div className="w-full mt-4 flex justify-center md:justify-start">
        <button className="w-full md:w-auto px-12 py-3 bg-white border border-gray-300 text-[#2d2d2d] text-[11px] md:text-xs font-black uppercase tracking-widest hover:bg-[#004b93] hover:text-white hover:border-[#004b93] transition-all duration-300">
          Discover All
        </button>
      </div>
    </div>
  );
};

const Sections = () => {
  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionsData.map((section) => (
          <ProductSection key={section.id} title={section.title} products={section.products} />
        ))}
      </div>
    </section>
  );
};

export default Sections;