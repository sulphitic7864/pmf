import React from 'react'
import { cardDetails, images } from '../constants/constants'
import { motion } from 'framer-motion'

function Success() {
  setTimeout(() => {
    window.location.href = '/'
  }, 8000)



  return (
    <div
      style={{ textAlign: 'center', marginTop: '100px', paddingBottom: '50px' }}
    >
         <div className='w-full md:w-1/2 h-full pl-16 lg:pl-[15%] pt-16 pr-10 md:py-28'>
            <motion.img
            initial={{ opacity: 0,scale:0.3 }}
            whileInView={{ opacity: 1,scale:1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            src={images.cameraman} alt="" className='w-full h-full bg-cover' />
        </div>
      <div>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <h3>Payment was successful</h3>
          <p>
            We have received your payment. Your order will be processed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Success