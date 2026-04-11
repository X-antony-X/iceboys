import { useState, useEffect } from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import CartSidebar from './CartSidebar';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {

      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full sticky top-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/60 backdrop-blur-lg shadow-md'
          : 'bg-white shadow-none'
      }`}
    >
      <TopBar 
        setMenuOpen={setIsMenuOpen} 
        searchOpen={isSearchOpen} 
        setSearchOpen={setIsSearchOpen} 
        setCartOpen={setIsCartOpen}
      />

      <NavBar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </header>
  );
};

export default Header;