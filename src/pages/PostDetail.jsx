import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  const [commentsToShow, setCommentsToShow] = useState(5); // Show 5 comments initially
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    body: ''
  });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // Update displayed comments when comments or commentsToShow changes
  useEffect(() => {
    setDisplayedComments(comments.slice(0, commentsToShow));
  }, [comments, commentsToShow]);

  const fetchPost = () => {
    fetch(`http://localhost:3000/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        setError(error.message);
      });
  };

  const fetchComments = () => {
    fetch(`http://localhost:3000/posts/${id}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setCommentsToShow(5); // Reset to show 5 comments when refreshing
      })
      .catch(error => console.error('Error fetching comments:', error));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Post deleted successfully!');
        navigate('/');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    
    if (!commentForm.name || !commentForm.email || !commentForm.body) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, ...commentForm })
      });

      if (response.ok) {
        setCommentForm({ name: '', email: '', body: '' });
        setShowCommentForm(false);
        fetchComments();
        alert('Comment added successfully!');
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Error creating comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchComments();
        alert('Comment deleted successfully!');
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  };

  // Load More Comments function
  const handleLoadMoreComments = () => {
    setCommentsToShow(prev => prev + 5); // Load 5 more comments
  };

  // Show Less Comments function
  const handleShowLessComments = () => {
    setCommentsToShow(5); // Reset to show only 5 comments
  };

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded">
          <p className="text-center text-red-500">Error: {error}</p>
          <Link to="/" className="block text-center mt-4 text-blue-600 hover:underline">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <p className="text-center mt-10">Loading...</p>
      </div>
    );
  }

  const hasMoreComments = comments.length > commentsToShow;
  const isShowingMore = commentsToShow > 5;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 mt-6 bg-white shadow rounded">
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-blue-600 hover:underline">← Back to All Posts</Link>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit-post/${id}`)}
              className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
            >
              <span>✏️</span>Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              <span>🗑️</span>Delete
            </button>
          </div>
        </div>

        {/* Post Display */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h2>
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Author:</span> {post.email}
          </p>
          {post.createdAt && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Created:</span> {new Date(post.createdAt).toLocaleString()}
            </p>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">{post.body}</p>

        {/* Comments Section */}
        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">💬 Comments ({comments.length})</h3>
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              <span>➕</span>Add Comment
            </button>
          </div>

          {/* Add Comment Form */}
          {showCommentForm && (
            <form onSubmit={handleCreateComment} className="bg-gray-50 p-4 rounded mb-6">
              <h4 className="font-semibold mb-3">Add a Comment</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Your comment"
                  value={commentForm.body}
                  onChange={(e) => setCommentForm({...commentForm, body: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                    Submit Comment
                  </button>
                  <button type="button" onClick={() => setShowCommentForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
          ) : (
            <>
              <div className="space-y-4">
                {displayedComments.map(comment => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                        <p className="text-sm text-blue-600">{comment.email}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-gray-700">{comment.body}</p>
                  </div>
                ))}
              </div>

              {/* Load More / Show Less Buttons */}
              <div className="mt-6 flex justify-center gap-3">
                {hasMoreComments && (
                  <button
                    onClick={handleLoadMoreComments}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
                  >
                    <span>📄</span>
                    Load More Comments ({comments.length - commentsToShow} remaining)
                  </button>
                )}
                
                {isShowingMore && (
                  <button
                    onClick={handleShowLessComments}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    <span>📄</span>
                    Show Less
                  </button>
                )}
              </div>

              {/* Comments Info */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {displayedComments.length} of {comments.length} comments
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;