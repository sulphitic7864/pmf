import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaFacebook, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';
import { getBlogById } from '../server/api_endpoints';
import { images } from '../constants/constants';
import { User, Calendar, Tag } from "lucide-react";

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract video ID from different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return null;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlogById(id);
        if (response.status && response.result) {
          setBlog(response.result);
        } else {
          throw new Error(response.message || 'Failed to fetch blog');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-white">{error}</div>;
  if (!blog) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Blog not found</div>;

  const embedUrl = getYouTubeEmbedUrl(blog.videoURL);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <h1 className="gradient-text text-5xl font-bold mb-4">{blog.title}</h1>
        
        {/* Meta Information */}
        <div className="flex items-center gap-4 mb-6 text-white text-sm">
          <span className="flex items-center gap-1">
            <User size={16} className="text-white" /> {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} className="text-white" /> {new Date(blog.createdAt).toLocaleDateString()}
          </span>
          {/* <span className="flex items-center gap-1">
            <Eye size={16} className="text-white" /> {blog.noOfReaders} readers
          </span> */}
          <span className="flex items-center gap-1">
            <Tag size={16} className="text-white" /> {blog.type}
          </span>
        </div>

         {/* Content */}
         <div className="mb-12 text-lg leading-relaxed">
          {blog.description}
        </div>

        {/* YouTube Video */}
        {embedUrl && (
          <div className="mb-8 aspect-w-16 aspect-h-9">
            <iframe
              src={embedUrl}
              className="w-full h-[500px]"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

       

        {/* Social Links */}
        <div className="mb-12">
          <h3 className="text-xl mb-4">Follow us:</h3>
          <div className="flex gap-4">
            <FaFacebook 
              size={24} 
              className="cursor-pointer hover:text-blue-500 transition-colors" 
              onClick={() => window.open("https://web.facebook.com/placemyfilms?_rdc=1&_rdr", "_blank")}
            />
            <FaInstagram 
              size={24} 
              className="cursor-pointer hover:text-purple-500 transition-colors" 
              onClick={() => window.open("https://www.instagram.com/placemyfilms/", "_blank")} 
            />
            <FaYoutube 
              size={24} 
              className="cursor-pointer hover:text-red-500 transition-colors" 
              onClick={() => window.open("https://www.youtube.com/channel/UC6dQ8Wn_Ng5H_t2tAAjDHFg", "_blank")} 
            />
            <FaTiktok
              size={24}
              className="cursor-pointer transition-colors hover:text-cyan-300"
              aria-label="Place My Films on TikTok"
              onClick={() => window.open("https://www.tiktok.com/@placemyfilms", "_blank", "noopener,noreferrer")}
            />
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <img src={images.logo} alt="logo" className="w-15" />
          <span className="text-2xl font-bold">Place My Films</span>
        </div>
      </div>
    </div>
  );
};

export default BlogView;