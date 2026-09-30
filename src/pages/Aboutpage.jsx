import { motion } from 'framer-motion'
import React from 'react'
import { images } from '../constants/constants'
const Aboutpage = () => {
  return (
    <div className='w-full min-h-screen'>
      <div className='w-full h-[calc(50vh-106px)] relative bg-about-banner bg-cover bg-center '>
        <div className='absolute flex items-center pl-10 md:pl-20 w-full h-full z-50 top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <h1 className='text-5xl md:text-7xl font-bold gradient-text'>About Us</h1>
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row h-auto bg-black'>
      <div className='w-full md:w-1/2 flex justify-end font-semibold md:pl-10 lg:pl-[13%] pt-16 px-10 md:px-0 overflow-hidden'>
            <motion.div
            initial={{ opacity: 0,x:-300 }}
            whileInView={{ opacity: 1,x:0}}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            >
                <h2 className='text-white/80 text-[2rem] font-normal leading-[50px] scale-y-[0.83]'>
                Place My Films enable Independent Filmmakers the ability to maximize revenue for their films. Unlike distributors that hold your films hostage with long-term contracts, making more money off of your films than you do, we make sure that you are the primary bread winner for your art. No backend fees, no percentage, and no ownership over your film. As a film aggregator, we walk your film directly to the streaming service’s door for a one-time fee, giving you the opportunity to earn every dime of your money! Because to us… Your success is our success!
                </h2>
            </motion.div>
        </div>

        <div className='w-full md:w-1/2 relative h-full px-10 md:px-0  md:pl-8 md:pr-[15%] py-10 md:mt-16 bg-black'>
            <motion.img
            initial={{ opacity: 0,scale:0.4 }}
            whileInView={{ opacity: 1,scale:1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            src={images.cameraman} alt="" className='w-full relative z-20 h-full bg-cover' />
        </div>
      </div>
    </div>
  )
}

export default Aboutpage