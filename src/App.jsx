import { Routes, Route } from 'react-router-dom'; // React Router for page navigation
import PostList from './pages/PostList';          // Import PostList page
import PostDetail from './pages/PostDetail';      // Import PostDetail page

const App = () => {
  return (
    <Routes>
      {/* Root route to show the list of posts */}
      <Route path="/" element={<PostList />} />
      {/* Route to show post details using dynamic :id */}
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  );
};

export default App;
