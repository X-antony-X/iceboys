import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase';

const NavBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  const [isPinned, setIsPinned] = useState(false);

  // --- 1. دالة توليد الرابط الديناميكي ---
  const createProductLink = (collectionName, categoryName) => {
    const col = collectionName.toLowerCase().replace(' collection', '').trim().replace(/\s+/g, '-');
    const cat = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
    
    // ✅ غيرنا "shop" لـ "products" عشان تطابق الـ Route اللي عندك في App.js
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
      <nav className="hidden md:flex bg-white border-b border-gray-100 justify-center gap-8 py-0 relative z-[70] w-full">
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
                  className={`text-[12px] font-extrabold tracking-[0.15em] transition-all duration-300 flex items-center gap-1.5 px-2 relative h-full
                    ${activeDesktopMenu === item.title ? 'text-[#004b93]' : 'text-[#2d2d2d] hover:text-[#004b93]'}`}
                >
                  {item.title} 
                  <FiChevronDown className={`transition-transform duration-500 ${activeDesktopMenu === item.title ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-0 left-0 h-[3px] bg-[#004b93] transition-all duration-300 ${activeDesktopMenu === item.title ? 'w-full' : 'w-0'}`} />
                </button>
              ) : (
                <Link 
                  to={item.path} 
                  className="text-[12px] font-extrabold tracking-[0.15em] text-[#2d2d2d] hover:text-[#004b93] transition-all px-2 relative h-full flex items-center group"
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
                                // ✅ هنا استخدمنا الدالة الديناميكية للرابط
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
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="w-[85%] max-w-[320px] bg-white h-full overflow-y-auto shadow-2xl animate-slideRight">
            <div className="flex items-center justify-between p-6 border-b">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#004b93] font-black tracking-tighter text-xl">ICE BOYS</Link>
              <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-gray-400"><FiX /></button>
            </div>
            
            <div className="flex flex-col py-2">
              {menuData.map((item, index) => (
                <div key={item.title} className="border-b border-gray-50 last:border-0">
                  <div 
                    className="flex items-center justify-between p-5" 
                    onClick={() => item.hasSub && setActiveAccordion(activeAccordion === index ? null : index)}
                  >
                    <span className={`text-[13px] font-black tracking-widest ${activeAccordion === index ? 'text-[#004b93]' : 'text-gray-800'}`}>
                      {item.title}
                    </span>
                    {item.hasSub && (
                      <FiChevronRight className={`transition-transform duration-300 ${activeAccordion === index ? 'rotate-90 text-[#004b93]' : 'text-gray-300'}`} />
                    )}
                  </div>
                  
                  {item.hasSub && activeAccordion === index && (
                    <div className="bg-gray-50/50 px-5 pb-5 space-y-6 pt-2 animate-fadeIn">
                      {item.subCategories.map((sub) => (
                        <div key={sub.name} className="flex flex-col">
                          <div className="font-black text-[11px] text-[#004b93] uppercase tracking-widest mb-3">{sub.name}</div>
                          <ul className="grid grid-cols-1 gap-3 pl-3 border-l-2 border-gray-200">
                            {sub.items.map(subItem => (
                              <li key={subItem}>
                                <Link 
                                  // ✅ تعديل رابط الموبايل أيضاً ليكون ديناميكي
                                  to={createProductLink(sub.name, subItem)} 
                                  onClick={() => setIsMenuOpen(false)}
                                  className="text-[13px] text-gray-500 font-bold"
                                >
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
            </div>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default NavBar;