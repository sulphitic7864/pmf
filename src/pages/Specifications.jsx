import { motion } from 'framer-motion'
import React from 'react'
import { images } from '../constants/constants'

const Specifications = () => {
  return (
    <div className='w-full min-h-screen'>
      {/* Banner Section */}
      <div className='w-full h-[calc(50vh-106px)] relative bg-about-banner bg-cover bg-center'>
        <div className='absolute flex items-center pl-10 md:pl-20 w-full h-full z-50 top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <h1 className='text-5xl md:text-7xl font-bold gradient-text'>Specifications</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className='w-full flex flex-col md:flex-row h-auto bg-black'>
        {/* Left Side - Text Content */}
        <div className='w-full md:w-1/2 flex justify-end font-semibold md:pl-10 lg:pl-[13%] pt-16 px-10 md:px-0 overflow-hidden'>
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className='text-white/80 text-[2rem] font-normal leading-[50px] scale-y-[0.83] mb-8'>
              Our delivery specifications ensure your film meets the highest quality standards for streaming platforms.
            </h2>

            <p className='text-white/70 text-lg mb-6'>
              Follow these technical requirements to ensure your content is ready for submission. Our team is available to help if you have any questions about preparing your deliverables.
            </p>

            <p className='text-white/70 text-lg'>
              Remember: Your film's technical quality directly impacts viewer experience and platform acceptance.
            </p>
          </motion.div>
        </div>

        {/* Right Side - Table */}
        <div className='w-full md:w-1/2 relative h-full px-10 md:px-0 md:pl-8 md:pr-[15%] py-10 md:mt-16 bg-black'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className='bg-black/80 border border-white/20 rounded-lg overflow-hidden shadow-lg relative z-20'
          >
            <div className='overflow-x-auto'>
              <table className='w-full text-white/90'>
                <thead>
                  <tr className='border-b border-white/20'>
                    <th className='p-4 text-left w-1/3'>Title</th>
                    <th className='p-4 text-left w-2/3'>Format</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Video Format TV</td>
                    <td className='p-4'>16:9, ProRes 422 HQ, MOV, MP4 (same for trailer)</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Video Format Movies</td>
                    <td className='p-4'>16:9, 2.35:1, ProRes 422 HQ, MOV, MP4 (same for trailer)</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Video Res</td>
                    <td className='p-4'>1080p or 4k</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Frame Rate</td>
                    <td className='p-4'>23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Scan Type</td>
                    <td className='p-4'>Progressive only</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Color Space</td>
                    <td className='p-4'>Rec. 709</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Minimum Bit Rate</td>
                    <td className='p-4'>250 Mbps</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Key Art (Poster)</td>
                    <td className='p-4'>16x6 and 3x4</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Captions</td>
                    <td className='p-4'>English SRT files</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Metadata</td>
                    <td className='p-4'>CVS file</td>
                  </tr>
                  <tr className='border-b border-white/20'>
                    <td className='p-4 font-medium'>Audio</td>
                    <td className='p-4'>
                      <ul className='list-disc pl-6'>
                        <li>1-Channel Mono</li>
                        <li>2-Channel Stereo: L-R or Dual-Mono</li>
                        <li>5-Channel 5.1 Surround Sound</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='p-4 text-center text-white/90 font-bold bg-red-900/30'>
              Trailer must not contain any nudity! Caption cannot be burned into film.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Specifications