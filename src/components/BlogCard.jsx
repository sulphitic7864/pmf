import React, { useState, useEffect } from 'react';
import { BiNote } from 'react-icons/bi';
import { IoMdPerson } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getAllBlogs } from '../server/api_endpoints';
import { jwtDecode } from 'jwt-decode';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';

const BlogCard = ({ selectedCategory, selectedAuthor }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLikes, setUserLikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [readCounts, setReadCounts] = useState({});
  const [userReads, setUserReads] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Get user ID from token if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.UserId);
    }
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        if (response.status && response.result) {
          setBlogs(response.result);
        } else {
          throw new Error(response.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Error fetching blogs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch like counts, read counts and user interactions (if logged in)
  useEffect(() => {
    const fetchInteractionData = async () => {
      try {
        // Fetch all blogs' like counts
        const likeCountsResponse = await fetch('https://backend.placemyfilms.com/blogReaction/getAllBlogLikeCounts');
        const likeCountsData = await likeCountsResponse.json();
        
        if (likeCountsData.status) {
          const countsMap = {};
          likeCountsData.data.forEach(item => {
            countsMap[item.blog_id] = item.like_count;
          });
          setLikeCounts(countsMap);
        }

        // Fetch all blogs' read counts
        const readCountsResponse = await fetch('https://backend.placemyfilms.com/blogRead/getAllBlogReadCounts');
        const readCountsData = await readCountsResponse.json();
        
        if (readCountsData.status) {
          const readCountsMap = {};
          readCountsData.data.forEach(item => {
            readCountsMap[item.blog_id] = item.read_count;
          });
          setReadCounts(readCountsMap);
        }

        // Only fetch user interactions if logged in
        if (userId) {
          // Fetch user likes
          const userLikesResponse = await fetch(`https://backend.placemyfilms.com/blogReaction/getByUser_id/${userId}`);
          const userLikesData = await userLikesResponse.json();
          
          if (userLikesData.status) {
            const likesMap = {};
            userLikesData.result.forEach(like => {
              likesMap[like.blog_id] = like.status === 'like';
            });
            setUserLikes(likesMap);
          }
          
          // Fetch user reads
          const userReadsResponse = await fetch(`https://backend.placemyfilms.com/blogRead/getByUser_id/${userId}`);
          const userReadsData = await userReadsResponse.json();
          
          if (userReadsData.status) {
            const readsMap = {};
            userReadsData.result.forEach(read => {
              readsMap[read.blog_id] = read.status === 'read';
            });
            setUserReads(readsMap);
          }
        }
      } catch (err) {
        console.error('Error fetching interaction data:', err);
      }
    };

    fetchInteractionData();
  }, [userId]);

  const handleLike = async (blogId) => {
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const newStatus = userLikes[blogId] ? 'unlike' : 'like';
      
      const response = await fetch('https://backend.placemyfilms.com/blogReaction/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          blog_id: blogId,
          status: newStatus
        })
      });

      const data = await response.json();
      
      if (data.status) {
        setUserLikes(prev => ({
          ...prev,
          [blogId]: !prev[blogId]
        }));
        
        setLikeCounts(prev => ({
          ...prev,
          [blogId]: prev[blogId] + (newStatus === 'like' ? 1 : -1)
        }));
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
  };

  const updateReadStatus = async (blogId) => {
    if (!userId) {
      navigate('/blog');
      return;
    }

    // If user hasn't already read this blog
    if (!userReads[blogId]) {
      try {
        const response = await fetch('https://backend.placemyfilms.com/blogRead/updateStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            blog_id: blogId,
            status: 'read'
          })
        });

        const data = await response.json();
        
        if (data.status) {
          setUserReads(prev => ({
            ...prev,
            [blogId]: true
          }));
          
          setReadCounts(prev => ({
            ...prev,
            [blogId]: (prev[blogId] || 0) + 1
          }));
        }
      } catch (err) {
        console.error('Error updating read status:', err);
      }
    }
  };

  const handleNavigation = (blogId) => {
    updateReadStatus(blogId);
    navigate(`/blog/view/${blogId}`);
  };

  const filteredBlogs = blogs.filter(blog => {
    const categoryMatch = selectedCategory === 'all' || blog.type === selectedCategory;
    const authorMatch = selectedAuthor === 'all' || blog.author === selectedAuthor;
    return categoryMatch && authorMatch;
  });

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-white">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-white bg-red-500 p-4 rounded">{error}</p>
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <p className="text-white">No blogs found for selected filters</p>
      </div>
    );
  }

  return (
    <>
      {filteredBlogs.map((blog) => (
        <div key={blog.id} className="w-full h-auto border-2 border-white p-5">
          <div className="flex gap-3">
            <p className="text-white flex items-center gap-1">
              <IoMdPerson />
              {blog.author}
            </p>
            <p className="text-white">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {blog.imageURL && (
            <div className="pt-4">
              <img 
                src={blog.imageURL} 
                alt={blog.title} 
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <h2 
            onClick={() => handleNavigation(blog.id)}
            className="text-4xl text-white uppercase underline pt-2 break-words cursor-pointer hover:text-gray-300 transition-colors"
          >
            {blog.title}
          </h2>
          
          <div className="pt-4 max-h-32 overflow-y-auto">
            <p className="text-white leading-7 break-words whitespace-pre-wrap">
              {blog.description}
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <div className="flex items-center gap-4">
              {/* Like section */}
              <div className="flex items-center gap-2">
                {userId ? (
                  userLikes[blog.id] ? (
                    <BiSolidHeart 
                      size={25} 
                      className="text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                      onClick={() => handleLike(blog.id)}
                    />
                  ) : (
                    <BiHeart 
                      size={25} 
                      className="text-white cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => handleLike(blog.id)}
                    />
                  )
                ) : (
                  <BiHeart 
                    size={25} 
                    className="text-white cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => navigate('/blog')}
                  />
                )}
                <span className="text-white">
                  {likeCounts[blog.id] || 0}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div 
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => handleNavigation(blog.id)}
              >
                <BiNote size={25} className="text-white group-hover:text-gray-300 transition-colors" />
                <p className="text-white underline group-hover:text-gray-300 transition-colors">Read more</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <span className="text-white bg-gray-800 px-2 py-1 rounded text-sm">
              {blog.type}
            </span>
            <span className="text-white bg-gray-800 px-2 py-1 rounded text-sm">
              {readCounts[blog.id] || 0} readers
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogCard;