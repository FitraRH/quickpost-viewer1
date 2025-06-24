import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow sticky top-0 z-50 w-screen">
      <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          {/* Icon image */}
          <img
            src="https://th.bing.com/th/id/OIP.GoBZFLEJeoEVEgGtAD5dJAHaHp?r=0&rs=1&pid=ImgDetMain"
            alt="Icon"
            className="w-10 h-10 object-cover rounded-full"
          />
          {/* App name */}
          <span className="text-xl font-bold text-pink-600 hover:text-pink-700">
            📮 QuickPost Viewer
          </span>
        </Link>

        {/* Optional link (like Home) */}
        <Link to="/" className="text-sm text-gray-600 hover:text-pink-600">
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;