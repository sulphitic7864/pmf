import React, { useState, useEffect } from 'react';
import { BiNote } from 'react-icons/bi';
import { IoMdPerson } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getAllBlogs } from '../server/api_endpoints';
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
        const likeCountsResponse = await fetch(API_ENDPOINTS.GET_BLOG_LIKE_COUNTS);
        const likeCountsData = await likeCountsResponse.json();
        
        if (likeCountsData.status) {
          const countsMap = {};
          likeCountsData.data.forEach(item => {
            countsMap[item.blog_id] = item.like_count;
          });
          setLikeCounts(countsMap);
        }

        // Fetch all blogs' read counts
        const readCountsResponse = await fetch(API_ENDPOINTS.GET_BLOG_READ_COUNTS);
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
          const userLikesResponse = await fetch(API_ENDPOINTS.GET_BLOG_LIKES_BY_USER(userId));
          const userLikesData = await userLikesResponse.json();
          
          if (userLikesData.status) {
            const likesMap = {};
            userLikesData.result.forEach(like => {
              likesMap[like.blog_id] = like.status === 'like';
            });
            setUserLikes(likesMap);
          }
          
          // Fetch user reads
          const userReadsResponse = await fetch(API_ENDPOINTS.GET_BLOG_READS_BY_USER(userId));
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
      
      const response = await fetch(API_ENDPOINTS.UPDATE_BLOG_REACTION, {
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
        const response = await fetch(API_ENDPOINTS.UPDATE_BLOG_READ, {
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
      <div className="col-span-full flex min-h-48 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <p className="text-sm text-gray-400">Loading stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full flex min-h-48 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/5 p-6">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="col-span-full flex min-h-48 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 text-center">
        <p className="text-lg font-medium text-white">No stories found</p>
        <p className="mt-2 text-sm text-gray-400">Try another category or author filter.</p>
      </div>
    );
  }

  return (
    <>
      {filteredBlogs.map((blog) => (
        <article key={blog.id} className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111416] p-4 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-950/30 sm:p-5">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-500 via-cyan-300 to-emerald-300 opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex min-w-0 items-center justify-between gap-3 text-xs text-gray-400">
            <p className="flex min-w-0 items-center gap-2 truncate text-gray-200">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                <IoMdPerson />
              </span>
              <span className="truncate">{blog.author}</span>
            </p>
            <p className="shrink-0 text-right">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {blog.imageURL && (
            <div className="mt-4 overflow-hidden rounded-lg bg-white/5">
              <img 
                src={blog.imageURL} 
                alt={blog.title} 
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <h2 
            onClick={() => handleNavigation(blog.id)}
            className="mt-4 cursor-pointer break-words text-2xl font-semibold leading-tight text-white transition-colors duration-200 group-hover:text-cyan-200 sm:text-[1.7rem]"
          >
            {blog.title}
          </h2>
          
          <div className="mt-3 min-h-16 flex-1">
            <p className="line-clamp-3 break-words whitespace-pre-wrap text-sm leading-6 text-gray-400">
              {blog.description}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-4">
              {/* Like section */}
              <div className="flex items-center gap-2">
                {userId ? (
                  userLikes[blog.id] ? (
                    <button type="button" aria-label="Unlike story" onClick={() => handleLike(blog.id)} className="text-red-400 transition-transform hover:scale-110 hover:text-red-300">
                      <BiSolidHeart size={22} />
                    </button>
                  ) : (
                    <button type="button" aria-label="Like story" onClick={() => handleLike(blog.id)} className="text-gray-300 transition-all hover:scale-110 hover:text-rose-400">
                      <BiHeart size={22} />
                    </button>
                  )
                ) : (
                  <button type="button" aria-label="Like story" onClick={() => navigate('/blog')} className="text-gray-300 transition-all hover:scale-110 hover:text-rose-400">
                    <BiHeart size={22} />
                  </button>
                )}
                <span className="text-sm text-gray-300">
                  {likeCounts[blog.id] || 0}
                </span>
              </div>
            </div>
            
            <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-100"
                onClick={() => handleNavigation(blog.id)}
              >
                <BiNote size={18} />
                Read story <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs capitalize text-cyan-200">
              {blog.type}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
              {readCounts[blog.id] || 0} readers
            </span>
          </div>
        </article>
      ))}
    </>
  );
};

export default BlogCard;