import { Link } from 'react-router-dom';

const specificationItems = [
  'Key Art (270x390)',
  'Key Art (800x450)',
  'Key Art (1920x720)',
  'Key Art (1920x1080)',
  'Subtitle File SRT',
  'Meta Data (TXT, DOC or PDF)',
  'Video File (MP4)',
  'Film Title',
];

const DashboardSpecifications = () => (
  <section className='mx-auto w-full max-w-4xl'>
    <h1 className='mb-6 text-center text-xl font-bold uppercase tracking-wide text-cyan-400 sm:text-2xl'>
      Upload Specifications
    </h1>
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6'>
      {specificationItems.map((item) => (
        <div
          key={item}
          className='flex min-h-20 items-center justify-center rounded-lg border border-cyan-400 px-4 py-5 text-center text-sm font-semibold text-cyan-400 sm:min-h-20 sm:text-base'
        >
          {item}
        </div>
      ))}
    </div>
    <Link
      to='/my-account/orders'
      className='mt-5 flex min-h-11 w-full items-center justify-center rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
    >
      Upload
    </Link>
  </section>
);

export default DashboardSpecifications;
