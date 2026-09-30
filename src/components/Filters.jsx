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
  };

  return (
    <div className="flex flex-wrap gap-3">
      <p className="text-gray-400 font-md">Filter by</p>

      {/* All Filter */}
      <div>
        <p
          className="text-white flex items-center gap-1 cursor-pointer underline"
          onClick={handleAllClick}
        >
          <MdAllInclusive />
          Show All
        </p>
      </div>

      {/* Categories Dropdown */}
      <div className="relative">
        <p
          className="text-white flex items-center gap-1 cursor-pointer underline"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <GrNotes />
          Categories ({selectedCategory}) <IoMdArrowDropdown size={25} />
        </p>
        {isCategoryOpen && (
          <ul className="absolute top-8 left-0 w-40 bg-black text-white rounded-lg shadow-lg z-10">
            {categories.map((category) => (
              <li
                key={category}
                className={`p-2 cursor-pointer ${
                  selectedCategory === category ? 'bg-black' : ''
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
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
        <p
          className="text-white flex items-center gap-1 cursor-pointer underline"
          onClick={() => setIsAuthorsOpen(!isAuthorsOpen)}
        >
          <IoMdPerson />
          Authors ({selectedAuthor})<IoMdArrowDropdown size={25} />
        </p>
        {isAuthorsOpen && (
          <ul className="absolute top-8 left-0 w-40 bg-black text-white rounded-lg shadow-lg z-10">
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <li 
                  key={index} 
                  className={`p-2 cursor-pointer ${
                    selectedAuthor === author ? 'bg-black' : ''
                  }`}
                  onClick={() => handleAuthorSelect(author)}
                >
                  {author}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-400">No authors found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Filters;