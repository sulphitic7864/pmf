// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import PricingCard from '../components/PricingCard'
import { motion } from 'framer-motion'
import { getAllPackage } from '../server/api_endpoints'
import { FaSpinner } from 'react-icons/fa'



// const packageDetails = [
//   {
//     title: 'Basic',
//     price: '99',
//     features: ['Upload your short horror film here!', 'Must be no more than 25 minutes', 'and no less than 23 minute.', '500MB limit.'],
//   },
//   {
//     title: 'Gold',
//     price: '299',
//     features: ['Upload your film here!', 'Film must be 75 minutes', 'or longer to qualify.', '1GB size limit.', 'Must be .zip (compressed).'],
//   },
// ]


const Pricingpage = () => {

  const [loading, setLoading] = useState(true);
  const [packagedetail, setPackageDetails] = useState(null);
  
  const GetPackageDetais = async () => {
    try {
  
      const response = await getAllPackage();
      setPackageDetails(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    GetPackageDetais();
  }, []);


  return (
    <div className='w-full min-h-auto'>
      <div className='w-full h-[calc(50vh-106px)] relative bg-about-banner bg-cover bg-center '>
        <div className='absolute flex items-center pl-10 md:pl-20 w-full h-full z-50 top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <h1 className='text-6xl md:text-7xl font-bold gradient-text h-24'>Pricing</h1>
        </div>
      </div>
      <div className='w-full h-auto bg-black md:px-28 xl:px-52'>
        <motion.h1
          initial={{ opacity: 0,y : 60 }}
          whileInView={{ opacity: 1,y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }} 
          className='text-6xl scale-y-[0.8] text-center pt-24 gradient-text h-44'>Our Packages
        </motion.h1>
        <motion.p
          initial={{ opacity: 0,y : 20 }}
          whileInView={{ opacity: 1,y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4,delay:0.1 }} 
          className='text-white text-center pt-3 text-2xl'>Success starts here…  {packagedetail?.message}</motion.p>
        <div className='grid lg:grid-cols-2 pt-16 px-5 w-full h-auto gap-6'>
          {
            loading ? 
            <div className="flex flex-col gap-2 justify-center items-center h-1/2">
              <FaSpinner className="animate-spin text-4xl" />
              <p>Loading stripe form . . .</p>
            </div>:
            packagedetail?.result &&
            packagedetail?.result.map((packagedata,index) => (
              <motion.div
              initial={{ opacity: 0,y : 200 }}
              animate={{ opacity: 1,y: 0 }}
              // viewport={{ once: true }}
              transition={{ duration: 0.8,delay:0.2*index }}
              key={index} className='w-full h-auto'
              >
              <PricingCard key={index} packageDetails={packagedata}/>
              </motion.div>
            ))

          }
          {/* <PricingCard packageDetails = {packageDetails[0]}/>
          <PricingCard packageDetails = {packageDetails[2]}/> */}
        </div>
      </div>
    </div>
  )
}

export default Pricingpage