import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiChevronRight, FiChevronDown, FiUser, FiHeart } from 'react-icons/fi';

const NavBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  // State جديد عشان نعرف هل المنيو اتفتحت بـ "ضغط" ولا مجرد "hover"
  const [isPinned, setIsPinned] = useState(false);

  const handleMouseEnter = (title) => {
    if (!isPinned) {
      setActiveDesktopMenu(title);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setActiveDesktopMenu(null);
    }
  };

  const handleToggleClick = (title) => {
    if (activeDesktopMenu === title && isPinned) {
      // لو متثبتة أصلاً ودست تاني، اقفلها خالص
      setActiveDesktopMenu(null);
      setIsPinned(false);
    } else {
      // ثبت المنيو
      setActiveDesktopMenu(title);
      setIsPinned(true);
    }
  };

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

return (
    <>
      {/* 1. Desktop NavBar */}
      <nav className="hidden md:flex bg-white border-b border-gray-100 justify-center gap-10 py-4 relative">
        {menuData.map((item) => (
          <div 
            key={item.title} 
            className="group" 
            onMouseEnter={() => handleMouseEnter(item.title)}
            onMouseLeave={handleMouseLeave}
          >
            {item.hasSub ? (
              <button 
                onClick={() => handleToggleClick(item.title)}
                className={`text-[13px] font-bold tracking-widest transition-colors flex items-center gap-1 
                  ${activeDesktopMenu === item.title ? 'text-[#004b93]' : 'text-[#2d2d2d]'} hover:text-[#004b93]`}
              >
                {item.title} 
                <FiChevronDown className={`transition-transform duration-300 ${activeDesktopMenu === item.title ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link 
                to={item.link} 
                className="text-[13px] font-bold tracking-widest text-[#2d2d2d] hover:text-[#004b93]"
                onClick={() => setIsPinned(false)} // لو راح لصفحة تانية فك التثبيت
              >
                {item.title}
              </Link>
            )}

            {item.hasSub && (
              <div 
                className={`absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 z-[60] flex justify-center p-10 gap-20 
                ${activeDesktopMenu === item.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
              >
                {/* نفس محتوى الميجا منيو بتاعك */}
                {item.subCategories.map((sub) => (
                  <div key={sub.name} className="flex flex-col gap-3">
                    <h4 className="font-bold text-[#004b93] text-sm border-b pb-2 mb-2">{sub.name}</h4>
                    <ul className="flex flex-col gap-2">
                      {sub.items.map((subItem) => (
                        <li key={subItem}>
                          <Link 
                            to={`/products/${subItem.toLowerCase()}`} 
                            onClick={() => {
                              setActiveDesktopMenu(null);
                              setIsPinned(false);
                            }} 
                            className="text-gray-500 hover:text-black text-sm transition-colors"
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
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="w-[85%] max-w-[320px] bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#004b93] font-bold uppercase">ICE BOYS</Link>
              <button onClick={() => setIsMenuOpen(false)} className="text-2xl"><FiX /></button>
            </div>
            <div className="flex flex-col">
              {menuData.map((item, index) => (
                <div key={item.title} className="border-b">
                  <div className="flex items-center justify-between p-4" onClick={() => item.hasSub && setActiveAccordion(activeAccordion === index ? null : index)}>
                    <span className="text-[13px] font-bold text-[#2d2d2d]">{item.title}</span>
                    {item.hasSub && <FiChevronRight className={activeAccordion === index ? 'rotate-90' : ''} />}
                  </div>
                  {item.hasSub && activeAccordion === index && (
                    <div className="bg-[#f9f9f9]">
                      {item.subCategories.map((sub) => (
                        <div key={sub.name} className="p-4 pl-8">
                          <div className="font-bold text-xs text-gray-700 mb-2">{sub.name}</div>
                          <ul className="flex flex-col gap-3 pl-2 border-l-2 border-[#004b93]">
                            {sub.items.map(subItem => (
                              <li key={subItem}>
                                <Link 
                                  to={`/products/${subItem.toLowerCase()}`} 
                                  onClick={() => setIsMenuOpen(false)} // اقفل المنيو بعد الاختيار
                                  className="text-sm text-gray-500"
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
          <div className="flex-1 bg-black/40" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default NavBar;