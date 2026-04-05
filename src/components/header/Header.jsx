import { useState } from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      <TopBar 
        setMenuOpen={setIsMenuOpen} 
        searchOpen={isSearchOpen} 
        setSearchOpen={setIsSearchOpen} 
      />
      <NavBar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />
    </header>
  );
};

export default Header;