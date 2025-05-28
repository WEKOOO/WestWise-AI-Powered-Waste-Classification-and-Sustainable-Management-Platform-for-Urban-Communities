import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // Import necessary components
import { Recycle } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
// import About from './pages/About'; // About page is not currently linked in nav
import Classification from './pages/Classification';

const App = () => {
  // Removed activeTab state

  // Function to determine NavLink class based on active state
  const getNavLinkClass = ({ isActive }) => {
    return `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive 
        ? 'bg-emerald-600 text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation using NavLink */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/" className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">EcoClassify</span>
            </NavLink>
            
            <div className="flex space-x-1">
              <NavLink
                to="/"
                className={getNavLinkClass}
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={getNavLinkClass}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/classification"
                className={getNavLinkClass}
              >
                Classification
              </NavLink>
              {/* Add NavLink for About page if needed */}
              {/* <NavLink to="/about" className={getNavLinkClass}>About</NavLink> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content using Routes */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classification" element={<Classification />} />
          {/* <Route path="/about" element={<About />} /> */}
          {/* Add a fallback route if needed */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Recycle className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">EcoClassify</span>
          </div>
          <p className="text-gray-400 mb-2">Smart Waste Classification System</p>
          <p className="text-sm text-gray-500">Capstone Project - DBS Foundation x Dicoding Coding Camp</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

