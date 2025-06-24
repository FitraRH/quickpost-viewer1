// src/pages/PostList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PostList = () => {
  // State to store the posts data that will be displayed (limited to first 20)
  const [posts, setPosts] = useState([]);
  
  // State to store unique user IDs extracted from all posts data
  const [users, setUsers] = useState([]);

  // Effect hook to fetch posts data when component mounts
  useEffect(() => {
    // Fetch all posts from JSONPlaceholder API
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => {
        // Only display first 20 posts for better performance and UX
        setPosts(data.slice(0, 20));
        
        // Extract unique user IDs from ALL posts data (not just the first 20)
        // This ensures we show all users even if their posts aren't in the first 20
        const uniqueUserIds = Array.from(new Set(data.map(post => post.userId)));
        setUsers(uniqueUserIds);
      });
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <>
      {/* Sticky navigation bar at the top */}
      <Navbar />

      {/* Main container with full screen width and gray background */}
      <div className="w-screen bg-gray-100 min-h-screen">
        
        {/* Responsive flex layout: column on mobile, row on large screens */}
        <div className="flex flex-col lg:flex-row px-6 gap-6 w-full">
          
          {/* Left section: Posts list - takes 60% width on large screens */}
          <div className="w-full lg:w-3/5 space-y-4 py-4">
            <h2 className="text-2xl font-bold">📬 Latest Posts</h2>
            
            {/* Map through posts array and render each post */}
            {posts.map(post => (
              <div key={post.id} className="bg-white p-4 shadow rounded">
                {/* Clickable post title that navigates to post detail page */}
                <Link to={`/post/${post.id}`}>
                  <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                    {post.title}
                  </h3>
                </Link>
                
                {/* Post body preview - truncated to 60 characters */}
                <p className="text-gray-600">{post.body.slice(0, 60)}...</p>
              </div>
            ))}
          </div>

          {/* Right section: Users list - takes 40% width on large screens */}
          <div className="w-full lg:w-2/5 space-y-2 py-4">
            <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
              <span role="img" aria-label="user">👤</span> Users
            </h2>
            
            {/* Map through unique user IDs and create clickable user cards */}
            {users.map(userId => {
              // Try to find a sample post from this user in the displayed posts
              let samplePost = posts.find(p => p.userId === userId);
              
              // Handle case where user has no posts in the first 20 displayed posts
              if (!samplePost) {
                // Calculate estimated post ID based on JSONPlaceholder pattern
                // User 1: posts 1-10, User 2: posts 11-20, User 6: posts 51-60, etc.
                const estimatedPostId = (userId - 1) * 10 + 1;
                
                return (
                  <Link to={`/post/${estimatedPostId}`} key={userId}>
                    <div className="bg-white p-3 rounded shadow hover:bg-gray-50 transition text-blue-600 hover:underline">
                      User ID: <span className="font-semibold"> {userId}</span>
                    </div>
                  </Link>
                );
              }
              
              // If user has a post in the displayed posts, link to that post
              return (
                <Link to={`/post/${samplePost.id}`} key={userId}>
                  <div className="bg-white p-3 rounded shadow hover:bg-gray-50 transition text-blue-600 hover:underline">
                    User ID: <span className="font-semibold"> {userId}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostList;