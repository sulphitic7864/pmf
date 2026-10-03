import React, { useState, useEffect } from 'react';
import { GrNotes } from 'react-icons/gr';
import { IoMdArrowDropdown, IoMdPerson } from 'react-icons/io';
import { IoPricetagSharp } from 'react-icons/io5';
import { MdAllInclusive } from 'react-icons/md';
import axios from 'axios';

const Filters = ({ onCategoryChange, onAuthorChange }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');

  const categories = ['all', 'story', 'article'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`https://backend.placemyfilms.com/blog/getAllBlogs`);
        const blogs = res.data.result || [];
        const uniqueAuthors = [...new Set(blogs.map((blog) => blog.author))];
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
    setIsCategoryOpen(false);
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author)
    onAuthorChange(author)
    setIsAuthorsOpen(false);
  }

  const handleAllClick = () => {
    setSelectedCategory('all');
    setSelectedAuthor('all');
    onCategoryChange('all');
    onAuthorChange('all');
    setIsCategoryOpen(false);
    setIsAuthorsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 text-sm text-gray-400">Filter by</span>

      {/* All Filter */}
      <div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/15 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          onClick={handleAllClick}
        >
          <MdAllInclusive />
          Show All
        </button>
      </div>

      {/* Categories Dropdown */}
      <div className="relative">
        <button
          type="button"
          aria-expanded={isCategoryOpen}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-gray-200 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <GrNotes />
          Categories <span className="text-gray-400">({selectedCategory})</span>
          <IoMdArrowDropdown className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>
        {isCategoryOpen && (
          <ul className="absolute left-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#141719] p-1 text-white shadow-xl">
            {categories.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  className={`w-full rounded-md px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-white/10 ${selectedCategory === category ? 'bg-cyan-400/10 text-cyan-300' : 'text-gray-200'}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tags */}
      {/* <div>
        <p className="text-white flex items-center gap-1 cursor-pointer underline">
          <IoPricetagSharp />
          Tags <IoMdArrowDropdown size={25} />
        </p>
      </div> */}

      {/* Authors Dropdown */}
      <div className="relative">
        <button
          type="button"
          aria-expanded={isAuthorsOpen}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-gray-200 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          onClick={() => setIsAuthorsOpen(!isAuthorsOpen)}
        >
          <IoMdPerson />
          Authors <span className="max-w-28 truncate text-gray-400">({selectedAuthor})</span>
          <IoMdArrowDropdown className={`transition-transform ${isAuthorsOpen ? 'rotate-180' : ''}`} />
        </button>
        {isAuthorsOpen && (
          <ul className="absolute left-0 top-full z-20 mt-2 max-h-64 w-44 overflow-y-auto rounded-lg border border-white/10 bg-[#141719] p-1 text-white shadow-xl">
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 ${selectedAuthor === author ? 'bg-cyan-400/10 text-cyan-300' : 'text-gray-200'}`}
                    onClick={() => handleAuthorSelect(author)}
                  >
                    {author}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-400">No authors found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Filters;