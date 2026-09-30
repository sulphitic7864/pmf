import React, { useState } from 'react';
import Filters from '../components/Filters';
import BlogCard from '../components/BlogCard';

const Blogpage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAuthorChange = (author) => {
    setSelectedAuthor(author);
  };

  return (
    <div className='w-full min-h-screen h-auto bg-black px-10 md:px-24 lg:px-44 pt-10 pb-24'>
      <div className='flex pb-10'>
        <Filters 
          onCategoryChange={handleCategoryChange} 
          onAuthorChange={handleAuthorChange}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-1'>
        <BlogCard 
          selectedCategory={selectedCategory} 
          selectedAuthor={selectedAuthor}
        />
      </div>
    </div>
  );
};

export default Blogpage;