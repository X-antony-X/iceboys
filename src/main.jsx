import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // 1. استيراد المكتبة
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/header/CartProvider.jsx';
import { WishlistProvider } from './components/header/WishlistProvider.jsx'
import { AuthProvider } from './components/pages/AuthProvider.jsx';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)