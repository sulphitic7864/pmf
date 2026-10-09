import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Film, MonitorPlay, ShieldCheck, Sparkles } from 'lucide-react'

const specificationRows = [
  { title: 'Video format TV', value: '16:9, ProRes 422 HQ, MOV, MP4 (same for trailer)' },
  { title: 'Video format movies', value: '16:9, 2.35:1, ProRes 422 HQ, MOV, MP4 (same for trailer)' },
  { title: 'Video resolution', value: '1080p or 4K' },
  { title: 'Frame rate', value: '23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60' },
  { title: 'Scan type', value: 'Progressive only' },
  { title: 'Color space', value: 'Rec. 709' },
  { title: 'Minimum bit rate', value: '250 Mbps' },
  { title: 'Key art (poster)', value: '16:9 and 3:4 ratios' },
  { title: 'Captions', value: 'English SRT files' },
  { title: 'Metadata', value: 'CVS file' },
  {
    title: 'Audio',
    value: '1-channel mono, 2-channel stereo (L-R or dual mono), or 5.1 surround sound',
  },
]

const requirementPills = [
  'High-quality master delivery',
  'Platform-ready export',
  'Subtitle and metadata support',
  'Broadcast-safe standards',
]

const Specifications = () => {
  return (
    <div className='w-full bg-[#05090c] text-white'>
      <div className='mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8'>
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className='relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#0b1217] via-[#0a1720] to-[#071015] shadow-[0_30px_90px_rgba(0,0,0,0.45)]'
        >
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),transparent_42%)]' />
          <div className='relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200'>
                <Sparkles size={12} />
                Submission standards
              </div>
              <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl'>Specifications</h1>
              <p className='mt-3 max-w-2xl text-sm text-gray-300 sm:text-base'>
                Deliver a polished, platform-ready film with the correct technical settings, captions, and artwork for approval.
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              {requirementPills.map((item) => (
                <span key={item} className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-200'>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.header>

        <div className='mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_1.15fr]'>
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className='rounded-2xl border border-white/10 bg-[#0b1115] p-5 sm:p-6'
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300'>
                <Film size={20} />
              </div>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300'>Delivery checklist</p>
                <h2 className='text-xl font-semibold text-white capitalize'>Ready to submit</h2>
              </div>
            </div>

            <div className='mt-5 space-y-4'>
              {[
                'Frame rates and aspect ratios aligned with platform standards',
                'Sound and subtitles prepared for accessibility and playback',
                'Artwork supplied in the correct dimensions for promotion',
              ].map((item) => (
                <div key={item} className='flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3'>
                  <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300'>
                    <CheckCircle2 size={15} />
                  </div>
                  <p className='text-sm leading-6 text-gray-300'>{item}</p>
                </div>
              ))}
            </div>

            <div className='mt-6 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-4'>
              <div className='mb-2 flex items-center gap-2 text-cyan-200'>
                <ShieldCheck size={18} />
                <span className='text-sm font-semibold capitalize'>Important note</span>
              </div>
              <p className='text-sm leading-6 text-gray-300'>
                Trailer content must not include nudity and subtitles must not be burned into the final video file.
              </p>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className='rounded-2xl border border-white/10 bg-[#0b1115] p-3 sm:p-4'
          >
            <div className='mb-4 flex items-center justify-between gap-3 px-2 pt-2'>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300'>Technical table</p>
                <h2 className='mt-1 text-xl font-semibold text-white capitalize'>Format requirements</h2>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300'>
                <MonitorPlay size={18} />
              </div>
            </div>

            <div className='overflow-hidden rounded-xl border border-white/10 bg-[#0a0f13]'>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse text-left text-sm text-gray-200'>
                  <thead>
                    <tr className='bg-white/[0.03] text-[11px] uppercase tracking-[0.12em] text-gray-400'>
                      <th className='px-4 py-3 font-medium'>Title</th>
                      <th className='px-4 py-3 font-medium'>Format</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specificationRows.map(({ title, value }, index) => (
                      <tr key={title} className={index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'}>
                        <td className='border-t border-white/10 px-4 py-3 align-top font-semibold text-white capitalize'>{title}</td>
                        <td className='border-t border-white/10 px-4 py-3 align-top text-gray-300'>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>
              <div className='flex items-center gap-2'>
                <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15'>!</span>
                <span>Trailer must not contain nudity and captions cannot be burned into the film.</span>
              </div>
              <ArrowRight size={16} className='shrink-0 text-red-200' />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default Specifications