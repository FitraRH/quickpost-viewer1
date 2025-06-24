import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">📮 QuickPost Viewer</h1>
      <p className="text-lg mb-6 text-gray-600">
        Explore user posts, read full details, or share your own thoughts.
      </p>
      <div className="space-x-4">
        <Link to="/posts">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            View Posts
          </button>
        </Link>
        <Link to="/create">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Create Post
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
