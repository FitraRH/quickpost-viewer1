import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        alert('Logged out successfully!');
        // Optionally redirect to home
        window.location.href = '/';
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout');
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 w-screen">
      <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://i.pinimg.com/originals/0f/9f/fb/0f9ffb500ee2b0398b78ef52faad6648.jpg"
            alt="Icon"
            className="w-10 h-10 object-cover rounded-full"
          />
          <span className="text-xl font-bold text-pink-600 hover:text-pink-700">
            📮 QuickPost Viewer
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-pink-600">
            Home
          </Link>

          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : user ? (
            // Authenticated user menu
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user.fullName || user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            // Guest user menu
            <div className="flex items-center space-x-2">
              <Link 
                to="/login"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;