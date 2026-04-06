import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiChevronRight, FiChevronDown, FiUser, FiHeart } from 'react-icons/fi';

const NavBar = ({ isMenuOpen, setIsMenuOpen }) => {
  // State للمنيو في الشاشات الكبيرة (التابلت والكمبيوتر)
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
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
      {/* Desktop NavBar */}
      <nav className="hidden md:flex bg-white border-b border-gray-100 justify-center gap-10 py-4 relative">
        {menuData.map((item) => (
          <div key={item.title} className="group" onMouseLeave={() => setActiveDesktopMenu(null)}>
            {item.hasSub ? (
              <button className="text-[13px] font-bold tracking-widest text-[#2d2d2d] hover:text-[#004b93] transition-colors flex items-center gap-1">
                {item.title} <FiChevronDown />
              </button>
            ) : (
              <Link to={item.link} className="text-[13px] font-bold tracking-widest text-[#2d2d2d] hover:text-[#004b93]">{item.title}</Link>
            )}

            {item.hasSub && (
              <div className={`absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 z-[60] flex justify-center p-10 gap-20 
                ${activeDesktopMenu === item.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'} 
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}>
                {item.subCategories.map((sub) => (
                  <div key={sub.name} className="flex flex-col gap-3">
                    <h4 className="font-bold text-[#004b93] text-sm border-b pb-2 mb-2">{sub.name}</h4>
                    <ul className="flex flex-col gap-2">
                      {sub.items.map((subItem) => (
                        <li key={subItem}>
                          {/* تحويل اسم المنتج لمسار URL */}
                          <Link 
                            to={`/products/${subItem.toLowerCase()}`} 
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