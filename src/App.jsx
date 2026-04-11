import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// users
import Header from './components/header/Header'
import Home from './components/home/Home'
import Footer from './components/footer/Footer'
import ProductPage from './components/display/ProductPage'
import WishlistPage from './components/display/WishlistPage';
import ContactSection from './components/pages/ContactSection';
import SignInPage from './components/pages/SignInPage';
import AboutIceBoys from './components/pages/AboutIceBoys';
import ShippingPolicy from './components/pages/ShippingPolicy';
import AccountPage from './components/pages/AccountPage';
import NotFoundPage from './components/pages/NotFoundPage';

// admin
import Add from './admin/components/Add'
import CategoryManager from './admin/components/CategoryManager';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-arrivals" element={<ProductPage />} />
        <Route path="/products/:category" element={<ProductPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/about" element={<AboutIceBoys />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* admin */}
        <Route path="/add" element={<Add />} />
        <Route path="/categories" element={<CategoryManager />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;