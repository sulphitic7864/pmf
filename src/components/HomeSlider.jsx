import React, { useEffect, useState } from 'react';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { textInputs } from '../constants/constants';
import { Link } from 'react-router-dom';

const HomeSlider = () => {
  const [state, setState] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state === 1) {
        setState(2);
      } else {
        setState(1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [state]);
  
  function stringToArrayWithUnicodeSpace(text) {
    if (typeof text !== 'string') {
      throw new Error('Input must be a string');
    }
    return text.split('').map(letter => (letter === ' ' ? '\u00A0' : letter));
  }
  
  return (
    <AnimatePresence mode="wait">
      {state === 1 && (
        <motion.div
          key="slide-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[calc(100vh-106px)] bg-black bg-hero-pattern bg-no-repeat bg-cover flex flex-col items-center justify-center"
        >
          <h1 className="text-white text-4xl sm:text-5xl md:text-[3.7rem] h-20 overflow-hidden mt-28 p-0 scale-y-[0.8]">
        {stringToArrayWithUnicodeSpace(textInputs.heading1).map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40,rotateZ: -30 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{ delay: index * 0.15, duration: 0.5, ease: 'easeInOut' }}
          className='inline-block'
        >
          {letter}
        </motion.span>
      ))}</h1>
          <h1 className="text-white text-4xl sm:text-5xl md:text-[3.3rem] font-bold md:pt-12 pb-2 scale-y-90">
          {stringToArrayWithUnicodeSpace(textInputs.heading2).map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 80 ,rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0}}
            transition={{ delay: index * 0.06, duration: 0.8, ease: 'easeInOut' }}
            className='inline-block'
          >
              {letter}
                  </motion.span>
              ))}
            </h1>
          <motion.div
            initial={{ opacity: 0, y: -50,rotateX: 80 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 1, duration : 0.8, ease: 'easeIn' }} 
          >
            <Link to={'/my-account/'}>
          <Button title="SUBMIT YOUR FILM" />
            </Link>
          </motion.div>
        </motion.div>
      )}

      {state === 2 && (
        <motion.div
          key="slide-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0}}
          transition={{ duration: 0.5 }}
          className="w-full h-[calc(100vh-106px)] bg-black bg-bannercopy bg-no-repeat bg-cover flex flex-col items-center justify-center leading-[1.4]"
        >
          <h1 className="text-white text-[1rem] pt-40 scale-y-[0.8]">
          {stringToArrayWithUnicodeSpace(textInputs.heading1).map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className='inline-block'
        >
          {letter}
        </motion.span>
      ))}
          </h1>
          <p className="text-white text-4xl sm:text-5xl md:text-[3.7rem] font-bold bg-gradient-to-b from-[#00B1DB] to-[#01F8DF]">
          {stringToArrayWithUnicodeSpace(textInputs.heading3).map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className='inline-block'
        >
          {letter}
        </motion.span>
      ))}
          </p>
          <p className="text-white text-4xl sm:text-5xl md:text-[3.3rem] font-bold pb-2 scale-y-90">
          {stringToArrayWithUnicodeSpace(textInputs.heading2).map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className='inline-block'
        >
          {letter}
        </motion.span>
      ))}
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration : 0.8, ease: 'easeIn' }} 
          >
            <Link to={'/my-account/'}>
              <Button title="SUBMIT YOUR FILM" fontsize={18} extraclass={'text-white scale-y-100'} />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeSlider;
