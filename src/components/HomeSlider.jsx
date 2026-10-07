import { useEffect, useState } from 'react';
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
                initial={{ opacity: 0, y: 40, rotateZ: -30 }}
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
                initial={{ opacity: 0, y: 80, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.06, duration: 0.8, ease: 'easeInOut' }}
                className='inline-block'
              >
                {letter}
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className='mt-9 flex flex-col items-center gap-3 sm:mt-11'
          >
            <Link
              to='/onboarding'
              className='group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(0,190,210,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,190,210,0.28)] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#03080b]'
            >
              Submit your film
              <span aria-hidden='true' className='text-lg transition-transform group-hover:translate-x-1'>→</span>
            </Link>
            <div className='flex flex-col items-center gap-2 text-sm text-white/80 sm:flex-row'>
              <p>If you already have an existing account, please login to your dashboard.</p>
              <Link
                to='/my-account/'
                className='inline-flex min-h-9 items-center justify-center rounded-full border border-cyan-300/50 px-5 py-1.5 font-bold uppercase tracking-wide text-cyan-100 transition-colors hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300'
              >
                Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {state === 2 && (
        <motion.div
          key="slide-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className='mt-9 flex flex-col items-center gap-3 sm:mt-11'
          >
            <Link
              to='/onboarding'
              className='group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(0,190,210,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,190,210,0.28)] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#03080b]'
            >
              Submit your film
              <span aria-hidden='true' className='text-lg transition-transform group-hover:translate-x-1'>→</span>
            </Link>
            <div className='flex flex-col items-center gap-2 text-sm text-white/80 sm:flex-row'>
              <p>If you already have an existing account, please login to your dashboard.</p>
              <Link
                to='/my-account/'
                className='inline-flex min-h-9 items-center justify-center rounded-full border border-cyan-300/50 px-5 py-1.5 font-bold uppercase tracking-wide text-cyan-100 transition-colors hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300'
              >
                Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeSlider;
