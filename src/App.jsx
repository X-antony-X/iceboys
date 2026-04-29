import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// === User Components ===
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
import ProductDetails from './components/pages/ProductDetails';
import Collections from './components/pages/Colletions';
import CollectionProducts from './components/pages/CollectionProducts';
import Checkout from './components/pages/Checkout';
import ScrollToTop from './components/pages/ScrollToTop';

// === Admin Components ===
import AdminHome from './admin/components/AdminHome'; // الصفحة الجديدة
import Add from './admin/components/Add'
import CategoryManager from './admin/components/CategoryManager';
import AddCollection from './admin/components/AddCollection';
import ManageProducts from './admin/components/ManageProducts';
import AdminHeroForm from './admin/components/AdminHeroForm';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';
import AddAdmin from './admin/components/AddAdmin';

// مكون Layout لليوزر عشان الـ Header والـ Footer
const UserLayout = () => (
  <>
    <Header />
    <main>
      <Outlet /> {/* هنا المسارات الفرعية هتظهر */}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        
        {/* === 1. مسارات المستخدمين (تظهر فيها Header و Footer) === */}
        <Route element={<UserLayout />}>
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
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* === 2. مسارات الأدمن (بدون Header أو Footer + محمية) === */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/add" element={<Add />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/add-collection" element={<AddCollection />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/admin-hero" element={<AdminHeroForm />} />
          <Route path="/add-admin" element={<AddAdmin />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;