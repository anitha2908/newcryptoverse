import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, TrendingUp, Search, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BarChart2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">Cryptoverse</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`flex items-center ${isActive('/')}`}>
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/cryptocurrencies" className={`flex items-center ${isActive('/cryptocurrencies')}`}>
              <TrendingUp className="h-5 w-5 mr-1" />
              <span>Cryptocurrencies</span>
            </Link>
            <Link to="/search" className={`flex items-center ${isActive('/search')}`}>
              <Search className="h-5 w-5 mr-1" />
              <span>Search</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                <span>Home</span>
              </div>
            </Link>
            <Link 
              to="/cryptocurrencies" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/cryptocurrencies')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>Cryptocurrencies</span>
              </div>
            </Link>
            <Link 
              to="/search" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/search')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                <span>Search</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;