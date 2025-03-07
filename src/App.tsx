import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CryptocurrenciesPage from './pages/CryptocurrenciesPage';
import CryptoDetailsPage from './pages/CryptoDetailsPage';
import ComparePage from './pages/ComparePage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cryptocurrencies" element={<CryptocurrenciesPage />} />
            <Route path="/crypto/:coinId" element={<CryptoDetailsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} Cryptoverse. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;