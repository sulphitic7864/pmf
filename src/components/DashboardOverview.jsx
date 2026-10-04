import { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Clock3,
  CloudUpload,
  FileVideo2,
  FolderOpen,
  Mail,
  MonitorPlay,
  ShieldCheck,
} from 'lucide-react'
import { API_ENDPOINTS } from '../server/api_endpoints'
import cameraman from '../assets/images/cameraman.png'

const getFileName = (url, fallback) => {
  if (!url) return fallback
  try {
    return decodeURIComponent(new URL(url, window.location.origin).pathname.split('/').pop()) || fallback
  } catch {
    return fallback
  }
}

const DashboardOverview = () => {
  const { pathname } = useLocation()
  const [accountName, setAccountName] = useState('Filmmaker')
  const [videos, setVideos] = useState([])
  const [quota, setQuota] = useState({ shortUsed: 0, shortTotal: 0, featureUsed: 0, featureTotal: 0 })
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    let isActive = true

    const loadDashboardData = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      let userId = localStorage.getItem('userid')
      try {
        userId = userId || jwtDecode(token).UserId
      } catch {
        if (isActive) setLoading(false)
        return
      }

      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      const results = await Promise.allSettled([
        axios.get(API_ENDPOINTS.GET_USER_DETAILS(userId), { headers }),
        axios.post(API_ENDPOINTS.GET_USER_VIDEOS, { user_id: userId }, { headers }),
        axios.post(API_ENDPOINTS.GET_USED_VIDEO_COUNTS, { user_id: userId }, { headers }),
      ])

      if (!isActive) return

      const accountData = results[0].status === 'fulfilled' ? results[0].value.data?.result?.[0] : null
      const videosData = results[1].status === 'fulfilled' ? results[1].value.data?.result : null
      const countData = results[2].status === 'fulfilled' ? results[2].value.data?.result : null

      if (accountData) setAccountName(accountData.displayName || accountData.username || accountData.firstName || 'Filmmaker')
      if (Array.isArray(videosData)) setVideos(videosData)
      setQuota({
        shortUsed: Number(countData?.package_99_count || 0),
        shortTotal: Number(countData?.count_99 || 0),
        featureUsed: Number(countData?.package_299_count || 0),
        featureTotal: Number(countData?.count_299 || 0),
      })
      setLoading(false)
    }

    loadDashboardData()
    return () => { isActive = false }
  }, [token])

  const remainingCredits = Math.max(0, quota.shortTotal - quota.shortUsed) + Math.max(0, quota.featureTotal - quota.featureUsed)
  const recentVideos = [...videos].slice(-3).reverse()

  if (pathname === '/my-account/submissions') {
    return (
      <div className='space-y-6'>
        <header>
          <p className='text-xs font-semibold uppercase text-cyan-300'>Your workspace / submissions</p>
          <h1 className='mt-2 text-2xl font-semibold sm:text-3xl'>My Submissions</h1>
          <p className='mt-2 text-sm text-gray-400'>Video files uploaded to your filmmaker account.</p>
        </header>
        <section className='overflow-hidden rounded-xl border border-white/10 bg-[#0b1115]'>
          <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
            <h2 className='font-semibold'>Uploaded files</h2>
            <span className='text-sm text-gray-400'>{loading ? 'Loading...' : `${videos.length} files`}</span>
          </div>
          {loading ? (
            <div className='p-8 text-center text-sm text-gray-400'>Loading your submissions...</div>
          ) : videos.length ? (
            <div className='divide-y divide-white/10'>
              {videos.map((video, index) => (
                <div key={video.id || video.url || index} className='flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300'><FileVideo2 size={20} /></span>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>{getFileName(video.url, `Film submission ${index + 1}`)}</p>
                      <p className='mt-1 text-xs text-gray-500'>{video.festivalTitle || `Package ${video.packageType || 'submission'}`}</p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-4 sm:justify-end'>
                    <span className='inline-flex items-center gap-1.5 text-xs text-emerald-300'><CheckCircle2 size={14} /> {video.submissionStatus || 'Submitted'}</span>
                    {video.url && <a href={video.url} target='_blank' rel='noreferrer' className='text-xs font-medium text-cyan-300 hover:text-cyan-100'>Open file</a>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center px-6 py-14 text-center'>
              <FolderOpen size={34} className='text-cyan-300' />
              <h3 className='mt-4 font-medium'>No submissions yet</h3>
              <p className='mt-2 max-w-sm text-sm leading-6 text-gray-400'>Once you upload a film, it will appear here.</p>
              <Link to='/my-account/orders' className='mt-5 inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90'>Start a submission <ArrowRight size={16} /></Link>
            </div>
          )}
        </section>
      </div>
    )
  }

  const stats = [
    { label: 'Files submitted', value: loading ? '—' : videos.length, icon: FileVideo2, tint: 'text-sky-300 bg-sky-400/10' },
    { label: 'Short-film uploads', value: loading ? '—' : `${quota.shortUsed} / ${quota.shortTotal}`, icon: Clock3, tint: 'text-emerald-300 bg-emerald-400/10' },
    { label: 'Feature-film uploads', value: loading ? '—' : `${quota.featureUsed} / ${quota.featureTotal}`, icon: CheckCircle2, tint: 'text-cyan-300 bg-cyan-400/10' },
    { label: 'Credits remaining', value: loading ? '—' : remainingCredits, icon: ShieldCheck, tint: 'text-amber-300 bg-amber-400/10' },
  ]

  return (
    <div className='grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_270px] xl:grid-cols-[minmax(0,1fr)_290px]'>
      <div className='min-w-0 space-y-5'>
        <section className='relative isolate flex min-h-36 items-center overflow-hidden rounded-xl border border-white/10 bg-[#0b1217] px-5 py-6 sm:px-8'>
          <img src={cameraman} alt='' aria-hidden='true' className='absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%] opacity-40' />
          <div className='absolute inset-0 -z-10 bg-gradient-to-r from-[#071015] via-[#071015]/90 to-[#071015]/20' />
          <div>
            <p className='text-xs font-semibold uppercase text-cyan-300'>Creator dashboard</p>
            <h1 className='mt-2 text-2xl font-semibold sm:text-3xl'>Welcome back, <span className='text-cyan-300'>{accountName}</span></h1>
            <p className='mt-2 text-sm text-gray-300'>Upload. Submit. Get placed.</p>
          </div>
          <div className='ml-auto hidden items-center gap-2 self-end text-[10px] font-semibold uppercase text-gray-300 sm:flex'>
            <span>Film</span><span className='h-1 w-1 rounded-full bg-cyan-300' /><span>TV</span><span className='h-1 w-1 rounded-full bg-cyan-300' /><span>Global</span>
          </div>
        </section>

        <section aria-label='Account overview' className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          {stats.map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className='min-w-0 rounded-xl border border-white/10 bg-[#0b1115] p-4'>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tint}`}><Icon size={18} /></div>
              <p className='mt-3 truncate text-xl font-semibold tabular-nums sm:text-2xl'>{value}</p>
              <p className='mt-1 text-xs leading-5 text-gray-400'>{label}</p>
            </div>
          ))}
        </section>

        <section className='rounded-xl border border-white/10 bg-[#0b1115] p-5 sm:p-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-start gap-3'>
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300'><CloudUpload size={22} /></span>
              <div>
                <h2 className='font-semibold'>New submission</h2>
                <p className='mt-1 max-w-xl text-sm leading-6 text-gray-400'>Your upload space is ready. Choose a film package to add a video to your account.</p>
              </div>
            </div>
            <Link to='/my-account/orders' className='inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#031015] transition-opacity hover:opacity-90'>Manage uploads <ArrowRight size={16} /></Link>
          </div>
          <div className='mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2'>
            <div className='rounded-lg border border-dashed border-white/15 bg-black/20 p-4'>
              <p className='text-sm font-medium'>Short film</p>
              <p className='mt-1 text-xs leading-5 text-gray-400'>For purchased short-film upload credits. Check package requirements before uploading.</p>
            </div>
            <div className='rounded-lg border border-dashed border-white/15 bg-black/20 p-4'>
              <p className='text-sm font-medium'>Feature film</p>
              <p className='mt-1 text-xs leading-5 text-gray-400'>For purchased feature-film upload credits. Supported formats and limits are shown during upload.</p>
            </div>
          </div>
        </section>
      </div>

      <aside className='min-w-0 space-y-5'>
        <section className='rounded-xl border border-white/10 bg-[#0b1115] p-4'>
          <div className='flex items-center justify-between gap-3 border-b border-white/10 pb-3'>
            <h2 className='text-sm font-semibold'>Recent submissions</h2>
            <Link to='/my-account/submissions' className='text-xs text-cyan-300 hover:text-cyan-100'>View all</Link>
          </div>
          {loading ? (
            <p className='py-6 text-center text-xs text-gray-500'>Loading uploads...</p>
          ) : recentVideos.length ? (
            <div className='divide-y divide-white/10'>
              {recentVideos.map((video, index) => (
                <div key={video.id || video.url || index} className='flex items-center gap-3 py-3'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300'><MonitorPlay size={19} /></span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-medium'>{video.title || getFileName(video.url, `Film ${videos.length - index}`)}</p>
                    <p className='mt-1 truncate text-[11px] text-emerald-300'>{video.festivalTitle || video.submissionStatus || 'Submitted'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-7 text-center'>
              <FolderOpen size={25} className='mx-auto text-gray-500' />
              <p className='mt-3 text-sm text-gray-300'>No files uploaded</p>
              <p className='mt-1 text-xs leading-5 text-gray-500'>Your uploaded films will appear here.</p>
            </div>
          )}
        </section>

        <section className='rounded-xl border border-white/10 bg-[#0b1115] p-4'>
          <h2 className='border-b border-white/10 pb-3 text-sm font-semibold'>Quick links</h2>
          <div className='mt-1 divide-y divide-white/10'>
            {[
              { label: 'Submission guidelines', to: '/specification', icon: FileVideo2 },
              { label: 'Browse film packages', to: '/contest', icon: FolderOpen },
              { label: 'Contact support', to: '/contact', icon: CircleHelp },
            ].map(({ label, to, icon: Icon }) => (
              <Link key={to} to={to} className='flex min-h-12 items-center gap-3 text-xs text-gray-300 transition-colors hover:text-cyan-200'>
                <Icon size={18} className='text-cyan-300' />
                <span className='flex-1'>{label}</span>
                <ArrowRight size={14} className='text-gray-500' />
              </Link>
            ))}
          </div>
        </section>

        <section className='rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-4'>
          <div className='flex items-center gap-2 text-cyan-200'><CircleHelp size={19} /><h2 className='text-sm font-semibold'>Need a hand?</h2></div>
          <p className='mt-2 text-xs leading-5 text-gray-400'>Our team can help with package or upload questions.</p>
          <Link to='/contact' className='mt-4 inline-flex min-h-9 items-center rounded-md border border-cyan-300/50 px-3 text-xs font-medium text-cyan-200 hover:bg-cyan-300/10'>Contact support</Link>
        </section>
      </aside>
    </div>
  )
}

export const MessagesScreen = () => (
  <section className='mx-auto flex min-h-[min(65vh,36rem)] max-w-3xl flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0b1115] px-6 py-12 text-center'>
    <span className='flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300'><Mail size={25} /></span>
    <p className='mt-5 text-xs font-semibold uppercase text-cyan-300'>Inbox</p>
    <h1 className='mt-2 text-2xl font-semibold'>No messages yet</h1>
    <p className='mt-3 max-w-md text-sm leading-6 text-gray-400'>Updates about your films and account messages will appear here.</p>
    <Link to='/contact' className='mt-6 inline-flex items-center gap-2 rounded-md border border-cyan-300/40 px-4 py-2.5 text-sm font-medium text-cyan-200 hover:bg-cyan-300/10'>Contact support <ArrowRight size={16} /></Link>
  </section>
)

export default DashboardOverview