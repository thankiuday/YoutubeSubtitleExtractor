import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import LearningHub from './components/LearningHub';
import './App.css';

const PROXY_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:3001';
const MAX_RETRIES = 3;
const RETRY_DELAY = 500;

const languages = [
  { code: 'en', name: 'English', available: true },
  { code: 'hi', name: 'Hindi', available: true },
  { code: 'es', name: 'Spanish', available: true },
  { code: 'fr', name: 'French', available: true },
  { code: 'de', name: 'German', available: true },
  { code: 'it', name: 'Italian', available: true },
  { code: 'pt', name: 'Portuguese', available: true },
  { code: 'ru', name: 'Russian', available: true },
  { code: 'ja', name: 'Japanese', available: true },
  { code: 'ko', name: 'Korean', available: true },
  { code: 'zh', name: 'Chinese', available: true }
];

function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-extrabold text-blue-600">YouTube Subtitle Extractor</Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-bold ${isActive('/')}`}>Home</Link>
            <Link to="/learning" className={`px-3 py-2 rounded-md text-sm font-bold ${isActive('/learning')}`}>Learning Hub</Link>
            <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-bold ${isActive('/about')}`}>About Us</Link>
            <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-bold ${isActive('/contact')}`}>Contact Us</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-bold ${isActive('/')}`}>Home</Link>
              <Link to="/learning" className={`block px-3 py-2 rounded-md text-base font-bold ${isActive('/learning')}`}>Learning Hub</Link>
              <Link to="/about" className={`block px-3 py-2 rounded-md text-base font-bold ${isActive('/about')}`}>About Us</Link>
              <Link to="/contact" className={`block px-3 py-2 rounded-md text-base font-bold ${isActive('/contact')}`}>Contact Us</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;