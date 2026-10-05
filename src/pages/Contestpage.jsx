import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaCheck, FaFileAlt, FaLock, FaMoneyBillWave } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa6'
import { getAllPackage } from '../server/api_endpoints'
import contestBackground from '../assets/images/film-contest-bg.jfif'

const ContestPage = () => {
  const [packages, setPackages] = useState([])
  const [packageError, setPackageError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadPackages = async () => {
      try {
        const response = await getAllPackage()
        if (response instanceof Error) throw response
        if (!Array.isArray(response?.result)) {
          throw new Error('The package response did not contain a list of packages.')
        }
        if (isMounted) setPackages(response.result)
      } catch (error) {
        console.error('Error fetching contest packages:', error)
        if (isMounted) setPackageError(true)
      }
    }

    loadPackages()
    return () => {
      isMounted = false
    }
  }, [])

  const contestPackage = packages.find((item) => Number(item.amount) === 25) ?? packages[0]
  const entryFee = contestPackage
    ? `$${Number(contestPackage.amount).toFixed(2)}`
    : packageError
      ? 'Unavailable'
      : '...'

  return (
    <main className='min-h-screen overflow-hidden bg-[#02090c] text-white'>
      <section
        className='relative isolate min-h-[590px] bg-[#02090c] bg-cover bg-[center_38%] sm:min-h-[620px] lg:min-h-[650px]'
        style={{ backgroundImage: `url("${contestBackground}")` }}
        aria-labelledby='contest-heading'
      >
        <div className='absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/15' />
        <div className='absolute inset-0 -z-10 bg-gradient-to-t from-[#02090c] via-transparent to-black/10' />

        <div className='mx-auto grid min-h-[590px] max-w-[1440px] items-center px-6 pb-24 pt-12 sm:min-h-[620px] sm:px-10 lg:min-h-[650px] lg:grid-cols-[1fr_0.9fr] lg:px-16'>
          <div className='max-w-[620px]'>
            <h1
              id='contest-heading'
              className='text-[clamp(3.8rem,10vw,6.5rem)] font-black leading-[0.84] tracking-[-0.065em]'
            >
              <span className='block'>FILM</span>
              <span className='block bg-gradient-to-r from-[#18b9ff] to-[#00e2b4] bg-clip-text text-transparent'>
                CONTEST
              </span>
            </h1>
            <p className='mt-6 text-xs font-medium uppercase tracking-[0.34em] text-white/85 sm:text-sm'>
              Submit. Compete. Get discovered.
            </p>
            <p className='mt-6 max-w-[510px] text-base leading-relaxed text-white/85 sm:text-lg'>
              Share your story with the world. Our film contest connects talented filmmakers with industry opportunities.
            </p>
            {contestPackage ? (
              <Link
                to={`/product/${contestPackage.id}`}
                className='mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-8 text-base font-bold text-white shadow-[0_8px_35px_rgba(0,211,202,0.24)] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-black sm:px-10 sm:text-lg'
              >
                Submit Now
                <FaArrowRight aria-hidden='true' />
              </Link>
            ) : (
              <button
                type='button'
                disabled
                className='mt-8 inline-flex min-h-14 cursor-not-allowed items-center justify-center gap-3 rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-8 text-base font-bold text-white opacity-60 sm:px-10 sm:text-lg'
                title={packageError ? 'Contest packages could not be loaded.' : 'Loading contest packages.'}
              >
                Submit Now
                <FaArrowRight aria-hidden='true' />
              </button>
            )}
            {packageError && (
              <p role='status' className='mt-3 text-sm text-rose-300'>
                Contest entry details could not be loaded. Please try again later.
              </p>
            )}
          </div>
          <div className='hidden lg:block' aria-hidden='true' />
        </div>
      </section>

      <section
        aria-label='Contest details'
        className='relative z-10 mx-auto -mt-16 max-w-[1370px] px-4 sm:-mt-[74px] sm:px-8 lg:px-10'
      >
        <div className='grid overflow-hidden rounded-2xl border border-[#12313a] bg-[rgba(0,11,15,0.94)] shadow-[0_18px_55px_rgba(0,0,0,0.48)] md:grid-cols-3'>
          <div className='flex min-h-[166px] flex-col items-center justify-center px-5 py-6 text-center'>
            <FaMoneyBillWave className='mb-4 text-[2.3rem] text-[#14c6f4]' aria-hidden='true' />
            <h2 className='text-sm font-bold uppercase text-white'>Entry Fee</h2>
            <p className='mt-1 text-4xl font-extrabold tracking-tight text-[#00d8d5]'>{entryFee}</p>
            <p className='mt-1 text-sm text-white/80'>per submission</p>
          </div>

          <div className='flex min-h-[166px] flex-col items-center justify-center border-y border-[#12313a] px-5 py-6 text-center md:border-x md:border-y-0'>
            <FaCalendarAlt className='mb-4 text-[2.3rem] text-[#14c6f4]' aria-hidden='true' />
            <h2 className='text-sm font-bold uppercase text-white'>Submission Deadline</h2>
            <p className='mt-3 text-xl font-bold text-[#00d6ad] sm:text-2xl'>March 31, 2026</p>
          </div>

          <div className='flex min-h-[166px] flex-col items-center justify-center px-5 py-6 text-center'>
            <FaFileAlt className='mb-4 text-[2.3rem] text-[#14c6f4]' aria-hidden='true' />
            <h2 className='text-sm font-bold uppercase text-white'>Eligible Formats</h2>
            <p className='mt-3 max-w-[260px] text-sm leading-relaxed text-white/80'>
              Feature, Short, Documentary, Animation and More
            </p>
          </div>
        </div>
      </section>

      <section className='mx-auto grid max-w-[1370px] gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.25fr_0.9fr] lg:gap-12 lg:px-10 lg:py-14'>
        <div>
          <h2 className='text-2xl font-extrabold uppercase tracking-tight sm:text-3xl'>Why Enter?</h2>
          <ul className='mt-6 space-y-4 text-base text-white/85 sm:text-lg'>
            <li className='flex items-center gap-3'>
              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#08d8a8] text-[#00201b]'>
                <FaCheck className='text-sm' aria-hidden='true' />
              </span>
              Get your film in front of industry professionals
            </li>
            <li className='flex items-center gap-3'>
              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#08d8a8] text-[#00201b]'>
                <FaCheck className='text-sm' aria-hidden='true' />
              </span>
              Gain exposure and new opportunities
            </li>
            <li className='flex items-center gap-3'>
              <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#08d8a8] text-[#00201b]'>
                <FaCheck className='text-sm' aria-hidden='true' />
              </span>
              Be part of a global community of filmmakers
            </li>
          </ul>
        </div>

        <div className='flex flex-col justify-center border-t border-[#12313a] pt-7 sm:pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0'>
          {contestPackage ? (
            <Link
              to={`/product/${contestPackage.id}`}
              className='inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-8 text-base font-bold text-white shadow-[0_8px_35px_rgba(0,211,202,0.2)] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-black sm:text-lg'
            >
              Submit Now
              <FaArrowRight aria-hidden='true' />
            </Link>
          ) : (
            <button
              type='button'
              disabled
              className='inline-flex min-h-14 cursor-not-allowed items-center justify-center gap-3 rounded-full bg-gradient-to-b from-sky-500 to-[#00D0B8] px-8 text-base font-bold text-white opacity-60 sm:text-lg'
            >
              Submit Now
              <FaArrowRight aria-hidden='true' />
            </button>
          )}
          <p className='mt-4 flex items-center justify-center gap-2 text-sm text-white/80'>
            <FaLock className='text-[#d9e5ea]' aria-hidden='true' />
            Secure online payment
          </p>
        </div>
      </section>
    </main>
  )
}

export default ContestPage
