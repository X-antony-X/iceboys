import { useState } from 'react';
import { FiX, FiChevronRight, FiChevronDown, FiUser, FiHeart } from 'react-icons/fi';

const NavBar = ({ isMenuOpen, setIsMenuOpen }) => {
  // داتا المنيو المتداخلة (مبنية على الفيديوهات اللي بعتها)
  const menuData = [
    { title: "NEW ARRIVALS", hasSub: false },
    {
      title: "COLLECTIONS",
      hasSub: true,
      subCategories: [
        {
          name: "Winter Collection",
          items: ["Sweatshirts", "Pullovers", "Jackets", "Pants", "T-Shirt"]
        },
        {
          name: "Summer Collection",
          items: ["T-Shirt", "Shorts", "Pants"]
        },
        { name: "Best Seller", items: [] }
      ]
    },
    { title: "ABOUT ICE BOYS", hasSub: false },
    { title: "SHIPPING POLICY", hasSub: false },
    { title: "CONTACT US", hasSub: false },
  ];

  // State للموبايل منيو (عشان نعرف أنهي قائمة مفتوحة)
  const [activeAccordion, setActiveAccordion] = useState(null);

  return (
    <>
      {/* --- 1. Desktop NavBar (Hover Mega Menu) --- */}
      <nav className="hidden md:flex bg-white border-b border-gray-100 justify-center gap-10 py-4 relative">
        {menuData.map((item) => (
          <div key={item.title} className="group">
            <button className="text-[13px] font-bold tracking-widest text-[#2d2d2d] hover:text-[#004b93] transition-colors flex items-center gap-1">
              {item.title}
              {item.hasSub && <FiChevronDown />}
            </button>

            {/* Mega Menu Dropdown */}
            {item.hasSub && (
              <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] flex justify-center p-10 gap-20">
                {item.subCategories.map((sub) => (
                  <div key={sub.name} className="flex flex-col gap-3">
                    <h4 className="font-bold text-[#004b93] text-sm border-b pb-2 mb-2 flex items-center justify-between min-w-[150px]">
                      {sub.name} <FiChevronRight />
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {sub.items.map((subItem) => (
                        <li key={subItem}>
                          <a href="#" className="text-gray-500 hover:text-black text-sm transition-colors">{subItem}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* --- 2. Mobile Sidebar Overlay (Accordion Style) --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in slide-in-from-left duration-300">
          {/* Menu Content */}
          <div className="w-[85%] max-w-[320px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
            
            {/* Header: User & Close */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#004b93] font-bold uppercase tracking-tighter">
                <span className="text-black">Ice</span> Boys
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-2xl p-1"><FiX /></button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col flex-1">
              {menuData.map((item, index) => (
                <div key={item.title} className="border-b border-gray-50">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => item.hasSub && setActiveAccordion(activeAccordion === index ? null : index)}
                  >
                    <span className="text-[13px] font-bold text-[#2d2d2d] tracking-wider">{item.title}</span>
                    {item.hasSub && (
                      <FiChevronRight className={`transition-transform duration-300 ${activeAccordion === index ? 'rotate-90' : ''}`} />
                    )}
                  </div>

                  {/* Sub-menu (Accordion) */}
                  {item.hasSub && activeAccordion === index && (
                    <div className="bg-[#f9f9f9] animate-in slide-in-from-top duration-200">
                      {item.subCategories.map((sub) => (
                        <div key={sub.name} className="p-4 border-b border-white last:border-0 pl-8 group">
                          <div className="flex items-center justify-between font-bold text-xs text-gray-700">
                            {sub.name}
                            <FiChevronRight />
                          </div>
                          {sub.items.length > 0 && (
                             <ul className="mt-3 flex flex-col gap-3 pl-2 border-l-2 border-[#004b93]">
                               {sub.items.map(subItem => (
                                 <li key={subItem} className="text-sm text-gray-500">{subItem}</li>
                               ))}
                             </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Bottom Actions (User Icons from video 2) */}
              <div className="p-6 flex flex-col gap-5 mt-auto bg-gray-50">
                <div className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <FiUser className="text-xl" /> <span className="text-sm font-medium">Sign In</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 cursor-pointer">
                  <FiHeart className="text-xl" /> <span className="text-sm font-medium">My Wish List</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay Background */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default NavBar;