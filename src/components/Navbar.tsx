import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Wealth Management', path: '/wealth-management' },
    { name: 'Estate Planning', path: '/estate-planning' },
    { name: 'Fiduciary Services', path: '/fiduciary-services' },
    { name: 'Our Heritage', path: '/heritage' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-[0_12px_32px_rgba(28,27,27,0.05)]">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-headline font-semibold text-on-surface">
          Heritage Trust
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 font-headline text-lg tracking-tight">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-on-surface opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="hidden sm:block silk-gradient text-on-primary px-6 py-2 rounded-sm font-label text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
          >
            Client Portal
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-background border-t border-outline-variant/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-xl font-headline text-on-surface py-2 group"
                >
                  {link.name}
                  <ChevronRight size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <div className="pt-6 border-t border-outline-variant/10">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full silk-gradient text-on-primary py-4 rounded-sm font-label text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Client Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
