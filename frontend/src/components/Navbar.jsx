import { Link } from 'react-router-dom';
import { RefreshCw } from 'react-feather';

export default function Navbar() {
  return (
    <nav className="bg-emerald-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-white">
            <RefreshCw className="mr-2" />
            <span className="text-xl font-bold">WestWise</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:text-emerald-200 px-3 py-2">Home</Link>
            <Link to="/classify" className="text-white hover:text-emerald-200 px-3 py-2">Classify</Link>
            <Link to="/about" className="text-white hover:text-emerald-200 px-3 py-2">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}