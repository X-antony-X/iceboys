import { FiMenu } from 'react-icons/fi';
import SearchBar from './SearchBar';
import ActionIcons from './ActionIcons';

const TopBar = ({ setMenuOpen, searchOpen, setSearchOpen }) => {
  return (
    <div className="bg-white py-3 px-4 md:px-8 border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto gap-4">
        
        {/* 1. الجانب الأيسر: المنيو (موبايل فقط) + اللوجو */}
        <div className="flex items-center gap-2 md:gap-0">
          {/* الـ hamburger menu يظهر فقط في الموبايل ويختفي من أول md */}
          <button 
            onClick={() => setMenuOpen(true)} 
            className="text-[#2d2d2d] text-2xl p-1 md:hidden hover:bg-gray-50 rounded-md transition-all"
          >
            <FiMenu />
          </button>

          {/* اللوجو: يكون على الشمال في الشاشات الكبيرة */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter whitespace-nowrap">
            <span className="text-[#004b93]">ICE</span> <span className="text-[#2d2d2d]">BOYS</span>
          </h1>
        </div>

        {/* 2. المنتصف: الـ Search Bar (يأخذ أكبر مساحة في الشاشات الكبيرة) */}
        {/* الـ flex-1 هنا هي اللي بتخلي البحث يفرش في النص */}
        <div className="flex-1 flex justify-center max-w-2xl">
          <SearchBar isOpen={searchOpen} setIsOpen={setSearchOpen} />
        </div>

        {/* 3. الجانب الأيمن: الأيقونات */}
        <div className="flex justify-end items-center">
          <ActionIcons />
        </div>

      </div>
    </div>
  );
};

export default TopBar;