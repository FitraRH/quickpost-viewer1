import { useParams } from 'react-router-dom';       // To read dynamic URL param
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';          // Navbar component

const PostDetail = () => {
  const { id } = useParams();                       // Get post ID from route
  const [post, setPost] = useState(null);           // Store selected post

  // Fetch post data when the ID changes
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(res => res.json())                      // Parse JSON
      .then(data => setPost(data));                // Save to state
  }, [id]);                                       // Re-run this effect when the ID changes

  // Show loading state
  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
        <Navbar />

        <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.body}</p>
        </div>
    </div>
);

};

export default PostDetail;
