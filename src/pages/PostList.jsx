import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [emails, setEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('http://localhost:3000/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setFilteredPosts(data);
        const uniqueEmails = Array.from(new Set(data.map(post => post.email)));
        setEmails(uniqueEmails);
      })
      .catch(error => console.error('Error fetching posts:', error));
  };

  // Handle search
  useEffect(() => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, posts]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="w-screen bg-gray-100 min-h-screen">
        <div className="flex flex-col lg:flex-row px-6 gap-6 w-full">
          
          {/* Main Posts Section */}
          <div className="w-full lg:w-3/5 space-y-4 py-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📬 Latest Posts</h2>
              <button
                onClick={() => navigate('/create-post')}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <span>➕</span>Create Post
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span>🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Posts List */}
            {currentPosts.length === 0 ? (
              <p className="text-gray-500">
                {searchTerm ? `No posts found for "${searchTerm}"` : 'No posts available'}
              </p>
            ) : (
              currentPosts.map(post => (
                <div key={post._id} className="bg-white p-4 shadow rounded">
                  <Link to={`/post/${post._id}`}>
                    <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600">{post.body.slice(0, 60)}...</p>
                  <p className="text-sm text-gray-400 mt-2">By: {post.email}</p>
                </div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-2 rounded ${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authors Sidebar */}
          <div className="w-full lg:w-2/5 space-y-2 py-4">
            <h2 className="text-xl font-bold border-b pb-2">📧 Authors</h2>
            {emails.map(email => {
              const samplePost = posts.find(p => p.email === email);
              return (
                <Link to={`/post/${samplePost?._id}`} key={email}>
                  <div className="bg-white p-3 rounded shadow hover:bg-gray-50 transition text-blue-600 hover:underline">
                    <span className="font-semibold">{email}</span>
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