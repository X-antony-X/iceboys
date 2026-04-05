import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Search Icon for Mobile Trigger */}
        <button onClick={() => setIsOpen(true)} className="md:hidden text-[#2d2d2d] text-2xl p-1">
        <FiSearch />
        </button>

      {/* Desktop Static Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <input
          type="text"
          placeholder="Search for items..."
          className="w-full py-2 px-5 pr-10 rounded-full bg-[#f2f2f2] text-sm border border-transparent focus:border-[#004b93] outline-none"
        />
        <FiSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
      </div>

      {/* Mobile Search Overlay (Image 3) */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                autoFocus
                type="text"
                placeholder="Search....."
                className="w-full py-3 px-4 pr-10 border border-black rounded-sm outline-none text-lg"
              />
              <FiSearch className="absolute right-3 top-4 text-xl" />
            </div>
            <button onClick={() => setIsOpen(false)} className="text-3xl p-1">
              <FiX />
            </button>
          </div>
          <div className="mt-10 text-center text-gray-400 font-medium">Start typing to search...</div>
        </div>
      )}
    </>
  );
};

export default SearchBar;