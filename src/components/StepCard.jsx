import React from 'react'
import { images } from '../constants/constants'
import { motion } from 'framer-motion'

const StepCard = ({image,title,text}) => {
  return (
    <div className='flex flex-col items-center'>
        <img src={image} alt='' className='w-44 aspect-square' />
        <h2 className=' uppercase text-[2rem] scale-y-[0.9] font-bold pt-6 gradient-text'>{title}</h2>
        <p className='text-white text-[1.5rem] scale-y-[0.9] leading-9 font-normal w-[90%] text-center '>{text}</p>
    </div>
  )
}

export default StepCard