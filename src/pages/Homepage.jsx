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
                </div>
            </section>

            <section className='relative isolate overflow-hidden bg-[#03080b] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24'>
                <div aria-hidden='true' className='pointer-events-none absolute -left-40 top-12 -z-10 h-96 w-96 rounded-full bg-sky-500/[0.09] blur-[120px]' />
                <div aria-hidden='true' className='pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-teal-400/[0.08] blur-[120px]' />

                <div className='mx-auto max-w-7xl'>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className='mx-auto max-w-2xl text-center'
                    >
                        <p className='text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300 sm:text-sm'>Your filmmaking journey</p>
                        <h2 className='mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl'>
                            Get started in <span className='bg-gradient-to-r from-[#00B1DB] to-[#01F8DF] bg-clip-text text-transparent'>3 simple steps</span>
                        </h2>
                        <p className='mx-auto mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-base'>
                            From your first upload to a decision, we make it easy to get your film in front of our team.
                        </p>
                    </motion.div>

                    <div className='relative mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
                        <div aria-hidden='true' className='pointer-events-none absolute left-[18%] right-[18%] top-16 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent lg:block' />
                        {cardDetails.map((card, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.1 * index }}
                                viewport={{ once: true }}
                                key={card.title}
                                className='relative z-10 h-full'
                            >
                                <StepCard {...card} />
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    )
}

export default Homepage