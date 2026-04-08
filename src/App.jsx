import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header'
import Home from './components/home/Home'
import Footer from './components/footer/Footer'
import ProductPage from './components/display/ProductPage'
import WishlistPage from './components/display/WishlistPage';
import ContactSection from './components/pages/ContactSection';
import SignInPage from './components/pages/SignInPage';
import AboutIceBoys from './components/pages/AboutIceBoys';
import ShippingPolicy from './components/pages/ShippingPolicy';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* المسار الجديد لاستقبال اسم القسم */}
        <Route path="/products/:category" element={<ProductPage />} />
        {/* مسار احتياطي لعرض كل المنتجات */}
        <Route path="/products" element={<ProductPage />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/about" element={<AboutIceBoys />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;