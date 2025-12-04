import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, Users, ShoppingBag, Mail, ShoppingCart } from 'lucide-react';
import { CartProvider, useCart } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Coaching from './pages/Coaching';
import Equipment from './pages/Equipment';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/:productId" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
        {/* Elegant Navigation */}
        <header className="sticky top-0 z-50 glass-effect border-b border-border">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Brand */}
              <Link to="/" className="group flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-bold text-xl drop-shadow-md">PT</span>
                </div>
                <span className="font-display font-bold text-xl text-black tracking-tight">
                  Pune Table Tennis
                </span>
              </Link>

              {/* Navigation Links */}
              <ul className="hidden md:flex items-center space-x-1">
                <NavLink to="/" icon={HomeIcon} label="Home" />
                <NavLink to="/coaching" icon={Users} label="Coaching" />
                <NavLink to="/equipment" icon={ShoppingBag} label="Equipment" />
                <NavLink to="/contact" icon={Mail} label="Contact" />
              </ul>

              {/* Cart & CTA Button */}
              <div className="flex items-center gap-4">
                <CartButton onOpenCart={() => setIsCartOpen(true)} />
                <div className="hidden lg:block">
                  <Link 
                    to="/contact" 
                    className="elegant-button text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <AnimatedRoutes />
        </main>

        {/* Elegant Footer */}
        <footer className="bg-slate-950/95 backdrop-blur-md text-white border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Column */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">DS</span>
                  </div>
                  <span className="font-display font-bold text-xl">Dream Sports Table Tennis</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  Elevating your game with expert coaching, premium equipment, and a passion for excellence in table tennis.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <FooterLink to="/">Home</FooterLink>
                  <FooterLink to="/coaching">Coaching</FooterLink>
                  <FooterLink to="/equipment">Equipment</FooterLink>
                  <FooterLink to="/contact">Contact</FooterLink>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-display font-semibold text-white mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>dstta786@gmail.com</li>
                  <li>+91 88307 71691</li>
                  <li>Mon-Sat: 9AM-7PM</li>
                  <li className="mt-3 text-slate-300">Deccan Gymkhana, Pune</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
              <p>&copy; 2025 Dream Sports Table Tennis. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="hover:text-accent-500 transition-colors">Privacy Policy</button>
              <button className="hover:text-accent-500 transition-colors">Terms of Service</button>
            </div>
            </div>
          </div>
        </footer>
        
        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
    </CartProvider>
  );
}

// Cart Button Component
function CartButton({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItems } = useCart();
  
  return (
    <button
      onClick={onOpenCart}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors duration-200"
      aria-label="Shopping Cart"
    >
      <ShoppingCart className="w-6 h-6 text-foreground" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}

// Navigation Link Component
function NavLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200 group
          ${isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
          }
        `}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
        <span>{label}</span>
      </Link>
    </li>
  );
}

// Footer Link Component
function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-slate-400 hover:text-primary transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

export default App;
