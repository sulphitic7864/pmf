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
    <main className='min-h-screen bg-[#07090a] px-5 pb-24 sm:px-8 lg:px-12'>
      <div className='mx-auto max-w-7xl pt-12 sm:pt-16'>
        <header className='border-b border-white/10 pb-8'>
          <p className='mb-3 text-xs font-semibold uppercase text-cyan-400'>Place My Films / Journal</p>
          <h1 className='text-4xl font-semibold text-white sm:text-5xl'>Stories from the set</h1>
          <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base'>Ideas, perspectives, and stories from filmmakers and the people who make the industry move.</p>
        </header>
        <section aria-label='Blog posts'>
          <div className='py-6'>
            <Filters
              onCategoryChange={handleCategoryChange}
              onAuthorChange={handleAuthorChange}
            />
          </div>
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:gap-6'>
            <BlogCard
              selectedCategory={selectedCategory}
              selectedAuthor={selectedAuthor}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Blogpage;