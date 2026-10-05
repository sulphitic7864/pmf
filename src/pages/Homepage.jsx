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
    <section className='relative isolate overflow-hidden bg-[#05090c] px-5 py-16 text-white sm:px-8 md:py-20 lg:px-12 lg:py-24'>
        <div className='pointer-events-none absolute -left-40 top-16 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]' />
        <div className='pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]' />

        <div className='mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 lg:gap-20'>
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75 }}
                viewport={{ once: true }}
                className='order-2 md:order-1'
            >
                <div className='relative mx-auto max-w-[560px]'>
                    <div className='absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-400/30 via-transparent to-teal-300/20 blur-xl' />
                    <div className='relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#10191d] shadow-[0_28px_90px_rgba(0,0,0,0.55)]'>
                        <img
                            src={images.cameraman}
                            alt='Independent filmmaker working behind a camera'
                            className='aspect-[4/5] w-full object-cover object-center'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-[#020607]/80 via-transparent to-transparent' />
                        <div className='absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-7 sm:left-7 sm:right-7'>
                            <div>
                                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300'>Your film. Your future.</p>
                                <p className='mt-1 text-xl font-semibold text-white sm:text-2xl'>Make your next move.</p>
                            </div>
                            <span aria-hidden='true' className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-cyan-200 backdrop-blur-sm'>↗</span>
                        </div>
                    </div>
                    <div aria-hidden='true' className='absolute -bottom-5 -right-4 h-20 w-20 rounded-2xl border border-cyan-300/20 sm:-right-6 sm:h-24 sm:w-24' />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75 }}
                viewport={{ once: true }}
                className='order-1 md:order-2'
            >
                <p className='flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300 sm:text-sm'>
                    <span aria-hidden='true' className='h-px w-9 bg-gradient-to-r from-cyan-400 to-teal-300' />
                    For independent filmmakers
                </p>
                <h1 className='mt-6 text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-6xl xl:text-7xl'>
                    Lights.
                    <br />
                    <span className='bg-gradient-to-r from-[#00B1DB] to-[#01F8DF] bg-clip-text text-transparent'>Camera.</span>
                    <br />
                    Action!
                </h1>
                <p className='mt-7 max-w-xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl lg:text-2xl'>
                    As your film aggregator, we make it easier to get your indie film in front of the right audience—and help you make money from your art.
                </p>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className='mt-8'
                >
                    <Link to='/contest' className='inline-flex rounded-full transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#05090c]'>
                        <Button title='SUBMIT YOUR FILM' textCol='white' fontsize={16} extraclass='tracking-[0.1px] py-3 hover:bg-gradient-to-tr' />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    </section>

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
            <Link to={'/contest'}
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