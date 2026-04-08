import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header'
import Home from './components/home/Home'
import Footer from './components/footer/Footer'
import ProductPage from './components/display/ProductPage'
import WishlistPage from './components/display/WishlistPage';

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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;