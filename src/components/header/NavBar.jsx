import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FiX, FiChevronDown, FiHeart } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const NavBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  const [isPinned, setIsPinned] = useState(false);

  // --- 1. منع السكرول في الصفحة الخلفية عند فتح المنيو ---
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // --- 2. دالة توليد الرابط الديناميكي ---
  const createProductLink = (collectionName, categoryName) => {
    const col = collectionName.toLowerCase().replace(' collection', '').trim().replace(/\s+/g, '-');
    const cat = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
    return `/products/${col}-${cat}`; 
  };

  const { data: dbCategories } = useQuery({
    queryKey: ['header_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('header_categories')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const menuData = [
    { title: "NEW ARRIVALS", hasSub: false, path: "/new-arrivals" },
    {
      title: "SHOP",
      hasSub: true,
      subCategories: dbCategories?.map(cat => ({
        name: cat.main_name,
        items: cat.sub_items
      })) || [] 
    },
    { title: "COLLECTIONS", hasSub: false, path: "/collections" },
    { title: "ABOUT ICE BOYS", hasSub: false, path: "/about" },
    { title: "SHIPPING POLICY", hasSub: false, path: "/shipping" },
    { title: "CONTACT US", hasSub: false, path: "/contact" },
  ];

  const handleMouseEnter = (title) => { if (!isPinned) setActiveDesktopMenu(title); };
  const handleMouseLeave = () => { if (!isPinned) setActiveDesktopMenu(null); };

  const handleToggleClick = (title) => {
    if (activeDesktopMenu === title && isPinned) {
      setActiveDesktopMenu(null);
      setIsPinned(false);
    } else {
      setActiveDesktopMenu(title);
      setIsPinned(true);
    }
  };

  return (
    <>
      {/* --- Desktop NavBar --- */}
      <nav className="hidden md:flex bg-white border-b border-gray-100 justify-center gap-4 lg:gap-10 py-0 relative z-[70] w-full mx-auto">
        {menuData.map((item) => (
          <div 
            key={item.title} 
            className="static"
            onMouseEnter={() => handleMouseEnter(item.title)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center h-16">
              {item.hasSub ? (
                <button 
                  onClick={() => handleToggleClick(item.title)}
                  className={`text-[11px] lg:text-[12px] font-extrabold tracking-[0.15em] transition-all duration-300 flex items-center gap-1.5 px-2 relative h-full
                    ${activeDesktopMenu === item.title ? 'text-[#004b93]' : 'text-[#2d2d2d] hover:text-[#004b93]'}`}
                >
                  {item.title} 
                  <FiChevronDown className={`transition-transform duration-500 ${activeDesktopMenu === item.title ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-0 left-0 h-[3px] bg-[#004b93] transition-all duration-300 ${activeDesktopMenu === item.title ? 'w-full' : 'w-0'}`} />
                </button>
              ) : (
                <Link 
                  to={item.path} 
                  className="text-[11px] lg:text-[12px] font-extrabold tracking-[0.15em] text-[#2d2d2d] hover:text-[#004b93] transition-all px-2 relative h-full flex items-center group"
                  onClick={() => setIsPinned(false)}
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#004b93] transition-all duration-300 group-hover:w-full" />
                </Link>
              )}
            </div>

            {item.hasSub && (
              <div 
                className={`absolute top-full left-0 w-full bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border-t border-gray-50 transition-all duration-500 z-[60] overflow-hidden
                ${activeDesktopMenu === item.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}
              >
                <div className="max-w-[1400px] mx-auto grid grid-cols-5 p-12 gap-10 bg-white">
                  {item.subCategories.length > 0 ? (
                    item.subCategories.map((sub) => (
                      <div key={sub.name} className="flex flex-col gap-4 animate-fadeIn">
                        <h4 className="font-black text-[#004b93] text-[13px] tracking-widest uppercase border-b border-gray-100 pb-3 mb-1">
                          {sub.name}
                        </h4>
                        <ul className="flex flex-col gap-2.5">
                          {sub.items.map((subItem) => (
                            <li key={subItem}>
                              <Link 
                                to={createProductLink(sub.name, subItem)} 
                                onClick={() => { setActiveDesktopMenu(null); setIsPinned(false); }} 
                                className="text-gray-500 hover:text-black text-[13px] font-bold transition-all hover:translate-x-1 inline-block"
                              >
                                {subItem}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm col-span-4 text-center py-10 font-bold">No collections available yet.</p>
                  )}
                  
                  <div className="col-span-1 bg-gray-50 rounded-2xl p-8 flex flex-col justify-center items-center text-center border border-gray-100">
                    <span className="text-[#004b93] font-black text-[10px] tracking-[0.2em] mb-2 uppercase">New Season</span>
                    <h5 className="font-black text-2xl mb-5 text-[#2d2d2d] leading-tight">ICE BOYS<br/>LOOKBOOK</h5>
                    <button className="text-[11px] font-black border-b-2 border-[#004b93] pb-1 hover:text-blue-800 transition-all">
                      VIEW COLLECTIONS
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* --- Mobile Sidebar --- */}
      {isMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9998] flex overflow-hidden font-sans">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 z-[9998]"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar Content */}
          <div 
            className="relative w-[90%] max-w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slideInLeft z-[9999]"
          >
            {/* Header المماثل للصورة (زر X داكن وشعار أزرق) */}
            <div className="flex h-[60px] border-b border-gray-200">
              <div className="flex-1 flex items-center justify-center border-r border-gray-200 bg-white">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-[#004b93] font-black tracking-[0.15em] text-xl"
                >
                  ICE BOYS
                </Link>
              </div>
              <button 
                type="button"
                onClick={() => setIsMenuOpen(false)} 
                className="w-[60px] flex items-center justify-center bg-[#2d2d2d] text-white hover:bg-black transition-colors"
              >
                <FiX size={28} />
              </button>
            </div>
            
            {/* Links Section (Blocky Style) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {menuData.map((item, index) => (
                <div key={item.title} className="flex flex-col">
                  {/* زر القائمة الرئيسي */}
                  <div 
                    className={`flex items-center justify-between p-5 cursor-pointer rounded-sm transition-all duration-300 ${
                      activeAccordion === index 
                        ? 'bg-[#004b93] text-white shadow-md' 
                        : 'bg-gray-100 text-[#2d2d2d] hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      if (item.hasSub) {
                        setActiveAccordion(activeAccordion === index ? null : index);
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    {item.hasSub ? (
                      <span className="text-[14px] font-black uppercase tracking-widest">
                        {item.title}
                      </span>
                    ) : (
                      <Link to={item.path} onClick={() => setIsMenuOpen(false)} className="text-[14px] font-black uppercase tracking-widest w-full">
                        {item.title}
                      </Link>
                    )}
                    
                    {item.hasSub && (
                      <FiChevronDown 
                        className={`transition-transform duration-300 ${activeAccordion === index ? 'rotate-180 text-white' : 'text-gray-500'}`} 
                        size={20} 
                      />
                    )}
                  </div>
                  
                  {/* القائمة المنسدلة (Submenu) */}
                  {item.hasSub && activeAccordion === index && (
                    <div className="bg-white border border-gray-100 mt-2 rounded-sm shadow-inner p-5 space-y-6 animate-fadeIn">
                      {item.subCategories.map((sub) => (
                        <div key={sub.name} className="flex flex-col">
                          <h4 className="font-black text-[12px] text-[#004b93] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                            {sub.name}
                          </h4>
                          <ul className="space-y-3">
                            {sub.items.map(subItem => (
                              <li key={subItem}>
                                <Link 
                                  to={createProductLink(sub.name, subItem)} 
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-[13px] text-gray-600 font-bold hover:text-[#004b93] flex items-center gap-2 transition-colors"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 block"></span>
                                  {subItem}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* ===== زر المفضلة الجديد ===== */}
              <div className="flex flex-col mt-2">
                <Link 
                  to="/wishlist" /* غير المسار ده لو صفحة المفضلة ليها اسم تاني عندك */
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-5 cursor-pointer rounded-sm bg-[#fff0f0] text-[#dc2626] hover:bg-[#ffe5e5] transition-all duration-300 border border-red-100"
                >
                  <FiHeart size={20} className="text-[#dc2626] drop-shadow-sm" />
                  <span className="text-[14px] font-black uppercase tracking-widest w-full">
                    Wishlist
                  </span>
                </Link>
              </div>
              {/* ============================= */}

              {/* Promo Banner (لافتة ترويجية لتعزيز شكل المتاجر العالمية) */}
              <div className="mt-8 border-2 border-[#004b93] p-6 text-center bg-[#f8fbff] rounded-sm">
                <h4 className="font-black text-[#2d2d2d] text-[16px] tracking-widest uppercase">Sale up to</h4>
                <span className="block text-[#004b93] font-black text-3xl my-2">60% OFF</span>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">On Selected Items</p>
              </div>
            </div>

          </div>
        </div>,
        document.body // تأكد إنك بتعمل render للـ portal بشكل صح
      )}
    </>
  );
};

export default NavBar;