const StepCard = ({ image, title, text }) => {
  const [stepNumber, ...stepName] = title.split('.')

  return (
    <article className='group relative flex h-full min-h-[300px] flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] px-6 py-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_22px_60px_rgba(0,190,220,0.1)] sm:px-8'>
      <div aria-hidden='true' className='pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition-colors group-hover:bg-teal-300/15' />
      <div className='relative flex h-32 w-32 items-center justify-center rounded-full border border-cyan-300/15 bg-[#071116] shadow-[inset_0_0_30px_rgba(34,211,238,0.07)]'>
        <div aria-hidden='true' className='absolute inset-2 rounded-full border border-white/[0.06]' />
        <img src={image} alt='' className='relative z-10 aspect-square w-24 object-contain transition-transform duration-300 group-hover:scale-105' />
      </div>
      <h2 className='mt-6 text-xl font-bold uppercase tracking-[0.08em] text-white sm:text-2xl'>
        <span className='mr-2 bg-gradient-to-r from-[#00B1DB] to-[#01F8DF] bg-clip-text text-transparent'>{stepNumber}.</span>
        <span>{stepName.join('.').trim()}</span>
      </h2>
      <p className='mt-3 max-w-xs text-sm leading-6 text-white/65 sm:text-base'>{text}</p>
      <div aria-hidden='true' className='mt-auto w-12 pt-6'>
        <div className='h-0.5 w-full rounded-full bg-gradient-to-r from-sky-400 to-teal-300 opacity-50 transition-all duration-300 group-hover:w-20 group-hover:opacity-100' />
      </div>
    </article>
  )
}

export default StepCard
