import { motion } from 'framer-motion'
import { images } from '../constants/constants'
import { Link } from 'react-router-dom'

const Aboutpage = () => {
  return (
    <div className='w-full min-h-screen'>
      <div className='w-full h-[calc(50vh-106px)] relative bg-about-banner bg-cover bg-center '>
        <div className='absolute flex items-center pl-10 md:pl-20 w-full h-full z-50 top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <h1 className='text-5xl md:text-7xl font-bold gradient-text'>About Us</h1>
        </div>
      </div>

      <section className='relative isolate overflow-hidden bg-[#05090c] px-5 py-16 text-white sm:px-8 md:py-20 lg:px-12 lg:py-24'>
        <div className='pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]' />
        <div className='pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]' />

        <div className='mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr] lg:gap-20'>
          <motion.div
            initial={{ opacity: 0, x: -36 }}
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
                <div className='absolute inset-0 bg-gradient-to-t from-[#020607]/85 via-transparent to-transparent' />
                <div className='absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7'>
                  <p className='text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300'>Independent stories deserve to be seen</p>
                  <p className='mt-2 text-xl font-semibold text-white sm:text-2xl'>Your film. Your rights. Your success.</p>
                </div>
              </div>
              <div aria-hidden='true' className='absolute -bottom-5 -right-4 h-20 w-20 rounded-2xl border border-cyan-300/20 sm:-right-6 sm:h-24 sm:w-24' />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            viewport={{ once: true }}
            className='order-1 md:order-2'
          >
            <p className='flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300 sm:text-sm'>
              <span aria-hidden='true' className='h-px w-9 bg-gradient-to-r from-cyan-400 to-teal-300' />
              Built for independent filmmakers
            </p>
            <h2 className='mt-6 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl'>
              Your film should work for <span className='bg-gradient-to-r from-[#00B1DB] to-[#01F8DF] bg-clip-text text-transparent'>you.</span>
            </h2>
            <p className='mt-7 text-base leading-relaxed text-white/75 sm:text-lg'>
              Place My Films helps independent filmmakers maximize revenue from their films. Unlike distributors that lock films into long-term contracts, we put you first: no backend fees, no percentage of your earnings, and no ownership over your film.
            </p>
            <p className='mt-4 text-base leading-relaxed text-white/75 sm:text-lg'>
              As a film aggregator, we take your film directly to streaming services for a one-time fee, so you have the opportunity to earn every dime. Because to us, your success is our success.
            </p>

            <div className='mt-7 grid gap-3 sm:grid-cols-3'>
              <div className='rounded-xl border border-white/10 bg-white/[0.04] p-4'>
                <p className='text-sm font-bold text-cyan-300'>No backend fees</p>
                <p className='mt-1 text-xs leading-relaxed text-white/60'>Keep more of what your film earns.</p>
              </div>
              <div className='rounded-xl border border-white/10 bg-white/[0.04] p-4'>
                <p className='text-sm font-bold text-cyan-300'>No percentage</p>
                <p className='mt-1 text-xs leading-relaxed text-white/60'>Your revenue stays yours.</p>
              </div>
              <div className='rounded-xl border border-white/10 bg-white/[0.04] p-4'>
                <p className='text-sm font-bold text-cyan-300'>You keep ownership</p>
                <p className='mt-1 text-xs leading-relaxed text-white/60'>Your creative work remains yours.</p>
              </div>
            </div>

            <Link
              to='/onboarding'
              className='mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-7 py-3 text-sm font-semibold uppercase text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#05090c]'
            >
              Create an account
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Aboutpage