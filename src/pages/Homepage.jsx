import React from 'react'
import Button from '../components/Button'
import { cardDetails, images } from '../constants/constants'
import HomeSlider from '../components/HomeSlider'
import { motion } from 'framer-motion'
import StepCard from '../components/StepCard'
import { Link } from 'react-router-dom'

const Homepage = () => {
    
  return (
    <>
    <div className='w-full h-full bg-black'>
        <HomeSlider />
    </div>
    <div className='w-full h-auto lg:h-[140vh]  flex flex-col md:flex-row bg-black'>
        <div className='w-full md:w-1/2 h-full pl-16 lg:pl-[15%] pt-16 pr-10 md:py-28'>
            <motion.img
            initial={{ opacity: 0,scale:0.3 }}
            whileInView={{ opacity: 1,scale:1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            src={images.cameraman} alt="" className='w-full h-1/2 lg:h-full bg-cover' />
        </div>
        <div className='w-full md:w-1/2 flex flex-col font-semibold  px-10 md:px-0 pl-12 md:pt-24 overflow-hidden'>
            <motion.div
            
            initial={{ opacity: 0,x:300 }}
            whileInView={{ opacity: 1,x:0}}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            >
                <h1 className='text-white text-[2.3rem] pt-20 md:pt-0 lg:pt-20 scale-y-[0.85] gradient-text flex flex-wrap '>LIGHTS...CAMERA...ACTION!</h1>
                <h2 className='text-white/90 md:w-2/3 text-[2.8rem] font-normal leading-[60px] scale-y-[0.83]'>
                AS YOUR FILM AGGREGATOR, LET US MAKE IT EASY FOR YOU TO GET YOUR INDIE FILM IN FRONT OF THE RIGHT AUDIENCE TO MAKE MONEY FOR YOUR ART TODAY!
                </h2>
                <motion.div 
                    initial={{ opacity: 0,scale:0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    >
                    <Link to={'/my-account/'} className='hover:scale-90 transtion-all duration-300 w-max '>
                        <Button title='SUBMIT YOUR FILM' textCol='white' fontsize={16} extraclass={'tracking-[0.1px] scale-y-[0.9] py-[10px] hover:bg-gradient-to-tr '}/>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    </div>

    <div className='w-full h-auto bg-black pt-24 pb-10 flex flex-col items-center'>
        <motion.h1
            initial={{ opacity: 0,y : 50 }}
            whileInView={{ opacity: 1,y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        className='gradient-text flex-1 text-center text-[3.5rem] scale-y-[0.85]'>Get started in 3 steps</motion.h1>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 mt-10 h-auto w-4/5'>
            {
            cardDetails.map((card,index) => (
                <motion.div
                    initial={{ opacity: 0,scale:0.5 }}
                    whileInView={{ opacity: 1,scale:1 }}
                    transition={{ duration: 0.8,delay:0.08 * index }}
                    viewport={{ once: true }}
                    key={index}
                >
                    <StepCard {...card} />
                </motion.div>
            ))
            }
        </div>
        <motion.div 
            initial={{ opacity: 0,scale:0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='mt-10'
        >
            <Link to={'/my-account/'}
                className='hover:scale-90 transition-all duration-500 w-max'
            >
            <Button title='SUBMIT FILM' fontsize={15} extraclass={'py-4 text-white scale-y-105 hover:bg-gradient-to-tr '} />
            </Link>
        </motion.div>
    </div>
    </>
  )
}

export default Homepage