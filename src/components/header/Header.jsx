import { useState } from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import CartSidebar from './CartSidebar';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      <TopBar 
        setMenuOpen={setIsMenuOpen} 
        searchOpen={isSearchOpen} 
        setSearchOpen={setIsSearchOpen} 
        setCartOpen={setIsCartOpen}
      />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <NavBar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />
    </header>
  );
};

export default Header;