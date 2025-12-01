import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, Users, ShoppingBag, Mail } from 'lucide-react';
import Home from './pages/Home';
import Coaching from './pages/Coaching';
import Equipment from './pages/Equipment';
import Contact from './pages/Contact';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Elegant Navigation */}
        <header className="sticky top-0 z-50 glass-effect border-b border-charcoal-100">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Brand */}
              <Link to="/" className="group flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-bold text-xl">DS</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl text-charcoal-950 tracking-tight">
                    Dream Sports
                  </span>
                  <span className="text-xs text-charcoal-500 font-medium -mt-1">
                    Table Tennis
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <ul className="hidden md:flex items-center space-x-1">
                <NavLink to="/" icon={HomeIcon} label="Home" />
                <NavLink to="/coaching" icon={Users} label="Coaching" />
                <NavLink to="/equipment" icon={ShoppingBag} label="Equipment" />
                <NavLink to="/contact" icon={Mail} label="Contact" />
              </ul>

              {/* CTA Button */}
              <div className="hidden lg:block">
                <Link 
                  to="/contact" 
                  className="elegant-button text-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <AnimatedRoutes />
        </main>

        {/* Elegant Footer */}
        <footer className="bg-charcoal-950 text-white border-t border-charcoal-900">
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
                <p className="text-charcoal-400 text-sm leading-relaxed max-w-md">
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
                <ul className="space-y-2 text-sm text-charcoal-400">
                  <li>info@dreamsports-tt.com</li>
                  <li>(555) 123-4567</li>
                  <li>Mon-Sat: 9AM-7PM</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-charcoal-800 flex flex-col md:flex-row justify-between items-center text-sm text-charcoal-500">
              <p>&copy; 2025 Dream Sports Table Tennis. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="hover:text-accent-500 transition-colors">Privacy Policy</button>
              <button className="hover:text-accent-500 transition-colors">Terms of Service</button>
            </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
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
            ? 'bg-charcoal-950 text-white' 
            : 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950'
          }
        `}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-accent-500' : 'text-charcoal-400 group-hover:text-charcoal-600'}`} />
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
        className="text-sm text-charcoal-400 hover:text-accent-500 transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

export default App;
