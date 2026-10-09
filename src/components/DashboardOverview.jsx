import { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  CloudUpload,
  CircleX,
  FileVideo2,
  FolderOpen,
  Eye,
  Mail,
  MonitorPlay,
  Trophy,
} from 'lucide-react'
import { API_ENDPOINTS } from '../server/api_endpoints'
import cameraman from '../assets/images/cameraman.png'
import TrackedVideoPlayer from './TrackedVideoPlayer'

const getFileName = (url, fallback) => {
  if (!url) return fallback
  try {
    return decodeURIComponent(new URL(url, window.location.origin).pathname.split('/').pop()) || fallback
  } catch {
    return fallback
  }
}

const formatSubmissionDate = (date) => {
  if (!date) return 'Date unavailable'
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const getSubmissionTimestamp = (video) => {
  const date = video.createdAt || video.created_at || video.uploadedAt || video.uploaded_at
  const timestamp = date ? new Date(date).getTime() : Number.NaN
  return Number.isNaN(timestamp) ? null : timestamp
}

export const RejectionReasonDialog = ({ selectedReason, onClose }) => {
  if (!selectedReason) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4'
      onClick={onClose}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='rejection-reason-title'
        className='w-full max-w-lg rounded-xl border border-white/10 bg-[#10191f] p-5 shadow-2xl'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-rose-300'>Submission review</p>
            <h2 id='rejection-reason-title' className='mt-1 text-lg font-semibold text-white'>
              Rejection reason
            </h2>
            <p className='mt-1 text-sm text-gray-400'>{selectedReason.title}</p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close rejection reason'
            className='rounded-md px-2 py-1 text-xl leading-none text-gray-400 hover:bg-white/10 hover:text-white'
          >
            ×
          </button>
        </div>
        <p className='mt-5 max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-gray-200'>
          {selectedReason.reason}
        </p>
        <div className='mt-5 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md border border-cyan-300/40 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-300/10'
          >
            Close
          </button>
        </div>
      </section>
    </div>
  )
}

const DashboardOverview = () => {
  const { pathname } = useLocation()
  const [accountName, setAccountName] = useState('Filmmaker')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null)
  const [selectedReason, setSelectedReason] = useState(null)
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
      ])

      if (!isActive) return

      const accountData = results[0].status === 'fulfilled' ? results[0].value.data?.result?.[0] : null
      const videosData = results[1].status === 'fulfilled' ? results[1].value.data?.result : null
      if (accountData) setAccountName(accountData.displayName || accountData.username || accountData.firstName || 'Filmmaker')
      if (Array.isArray(videosData)) setVideos(videosData)
      setLoading(false)
    }

    loadDashboardData()
    return () => { isActive = false }
  }, [token])

  const recentVideos = videos
    .map((video, index) => ({ video, index, timestamp: getSubmissionTimestamp(video) }))
    .sort((a, b) => {
      if (a.timestamp !== null && b.timestamp !== null) return b.timestamp - a.timestamp
      if (a.timestamp !== null) return -1
      if (b.timestamp !== null) return 1
      return b.index - a.index
    })
    .slice(0, 2)
  const updateViewCount = (videoId, viewCount) => {
    setVideos((currentVideos) => currentVideos.map((video) => (
      video.id === videoId ? { ...video, viewCount } : video
    )))
  }

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
                <div
                  key={video.id || video.url || index}
                  className='grid grid-cols-1 items-center gap-x-5 gap-y-4 px-5 py-5 lg:grid-cols-12'
                >
                  <div className='flex min-w-0 items-center gap-3 lg:col-span-3'>
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300'><FileVideo2 size={20} /></span>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-semibold text-white'>{video.title || getFileName(video.url, `Film submission ${index + 1}`)}</p>
                      <p className='mt-1 line-clamp-2 text-xs leading-5 text-gray-500'>
                        {video.festivalTitle || `Free ${video.packageType === '99' ? 'short-film' : 'feature-film'} submission`}
                      </p>
                    </div>
                  </div>
                  {video.url && (
                    <div className='min-w-0 lg:col-span-3'>
                      <TrackedVideoPlayer
                        video={video}
                        className='aspect-video w-full rounded-md'
                        onViewCountChange={updateViewCount}
                      />
                    </div>
                  )}
                  {!video.url && <div className='hidden lg:col-span-3 lg:block' />}
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2 lg:col-span-2 lg:flex-col lg:items-start lg:gap-2'>
                    <span className='inline-flex items-center gap-1.5 text-xs text-cyan-200'>
                      <Eye size={14} /> {Number(video.viewCount || 0)} views
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                      video.submissionStatus === 'rejected'
                        ? 'border-rose-300/20 bg-rose-300/[0.06] text-rose-300'
                        : video.submissionStatus === 'approved'
                          ? 'border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-300'
                          : 'border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200'
                    }`}>
                      <CheckCircle2 size={14} />
                      {(video.submissionStatus || 'Submitted').replace(/^./, (letter) => letter.toUpperCase())}
                    </span>
                  </div>
                  <div className='min-w-0 lg:col-span-3'>
                    {video.submissionStatus === 'rejected' && video.reviewReason ? (
                      <>
                        <p className='text-xs font-semibold text-rose-300'>Reason</p>
                        <button
                          type='button'
                          onClick={() => setSelectedReason({
                            title: video.title || `Film submission #${video.id}`,
                            reason: video.reviewReason,
                          })}
                          className='mt-1 line-clamp-2 w-full text-left text-sm leading-5 text-gray-300 hover:text-white'
                          aria-label={`View full rejection reason for ${video.title || `film submission ${video.id}`}`}
                        >
                          {video.reviewReason}
                        </button>
                        <button
                          type='button'
                          onClick={() => setSelectedReason({
                            title: video.title || `Film submission #${video.id}`,
                            reason: video.reviewReason,
                          })}
                          className='mt-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200'
                        >
                          View full reason
                        </button>
                      </>
                    ) : (
                      <p className='text-xs text-gray-600'>No review notes</p>
                    )}
                  </div>
                  <div className='text-xs text-gray-400 lg:col-span-1 lg:text-right'>
                    <p>Submitted</p>
                    <time className='mt-1 block whitespace-nowrap' dateTime={video.createdAt}>
                      {formatSubmissionDate(video.createdAt)}
                    </time>
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
        <RejectionReasonDialog
          selectedReason={selectedReason}
          onClose={() => setSelectedReason(null)}
        />
      </div>
    )
  }

  const stats = [
    { label: 'Files submitted', value: loading ? '—' : videos.length, icon: FileVideo2, tint: 'text-sky-300 bg-sky-400/10' },
    { label: 'Festival entries', value: loading ? '—' : videos.filter((video) => video.festivalId).length, icon: Trophy, tint: 'text-emerald-300 bg-emerald-400/10' },
    { label: 'Film views', value: loading ? '—' : videos.reduce((total, video) => total + Number(video.viewCount || 0), 0), icon: Eye, tint: 'text-cyan-300 bg-cyan-400/10' },
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

        <section aria-label='Account overview' className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
          {stats.map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className='min-w-0 rounded-xl border border-white/10 bg-[#0b1115] p-4'>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tint}`}><Icon size={18} /></div>
              <p className='mt-3 truncate text-xl font-semibold tabular-nums sm:text-2xl'>{value}</p>
              <p className='mt-1 text-xs leading-5 text-gray-400 capitalize'>{label}</p>
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
            <Link to='/my-account/orders' className='inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#031015] transition-opacity hover:opacity-90 capitalize'>Manage uploads <ArrowRight size={16} /></Link>
          </div>
          <div className='mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2'>
            <div className='rounded-lg border border-dashed border-white/15 bg-black/20 p-4'>
              <p className='text-sm font-medium capitalize'>Short film</p>
              <p className='mt-1 text-xs leading-5 text-gray-400'>For purchased short-film upload credits. Check package requirements before uploading.</p>
            </div>
            <div className='rounded-lg border border-dashed border-white/15 bg-black/20 p-4'>
              <p className='text-sm font-medium capitalize'>Feature film</p>
              <p className='mt-1 text-xs leading-5 text-gray-400'>For purchased feature-film upload credits. Supported formats and limits are shown during upload.</p>
            </div>
          </div>
        </section>
      </div>

      <aside className='min-w-0 space-y-5'>
        <section className='rounded-xl border border-white/10 bg-[#0b1115] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.18)]'>
          <div className='flex items-center justify-between gap-3 border-b border-white/10 pb-3'>
            <div>
              <h2 className='text-sm font-semibold capitalize'>Recent submissions</h2>
              <p className='mt-1 text-[11px] text-gray-500'>Your latest 2 films</p>
            </div>
            <Link to='/my-account/submissions' className='inline-flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2.5 py-1.5 text-[11px] font-medium text-cyan-200 transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/10'>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <p className='py-6 text-center text-xs text-gray-500'>Loading uploads...</p>
          ) : recentVideos.length ? (
            <div className='space-y-2.5 pt-3'>
              {recentVideos.map(({ video }, index) => (
                <div
                  key={video.id || video.url || index}
                  className='group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-3 transition-colors hover:border-cyan-300/20 hover:from-cyan-300/[0.07]'
                >
                  <div aria-hidden='true' className='absolute inset-y-3 left-0 w-0.5 rounded-full bg-gradient-to-b from-sky-400 to-teal-300 opacity-70' />
                  <div className='flex items-start gap-3 pl-1'>
                    {video.url ? (
                      <button
                        type='button'
                        aria-label={`${playingVideoUrl === video.url ? 'Close' : 'Play'} ${video.title || 'film submission'}`}
                        aria-expanded={playingVideoUrl === video.url}
                        onClick={() => setPlayingVideoUrl((activeUrl) => activeUrl === video.url ? null : video.url)}
                        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200 transition-colors hover:border-cyan-300/35 hover:bg-cyan-300/[0.13] focus:outline-none focus:ring-2 focus:ring-cyan-300'
                      >
                        <MonitorPlay size={18} />
                      </button>
                    ) : (
                      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200'>
                        <MonitorPlay size={18} />
                      </span>
                    )}
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-xs font-semibold text-white'>{video.title || getFileName(video.url, `Film ${videos.length - index}`)}</p>
                      <p className='mt-1 truncate text-[11px] text-gray-400'>{video.festivalTitle || `Free ${video.packageType === '99' ? 'short-film' : 'feature-film'} submission`}</p>
                      <div className='mt-2 flex flex-wrap items-center gap-x-3 gap-y-1'>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          video.submissionStatus === 'rejected'
                            ? 'border-rose-300/15 bg-rose-300/[0.06] text-rose-200'
                            : video.submissionStatus === 'approved'
                              ? 'border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-200'
                              : 'border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-200'
                        }`}>
                          <CheckCircle2 size={11} />
                          {(video.submissionStatus || 'Submitted').replace(/^./, (letter) => letter.toUpperCase())}
                        </span>
                        <span className='inline-flex items-center gap-1 text-[10px] text-cyan-200'>
                          <Eye size={11} /> {Number(video.viewCount || 0)} views
                        </span>
                      </div>
                      <p className='mt-2 truncate text-[10px] text-gray-500'>{formatSubmissionDate(video.createdAt || video.created_at || video.uploadedAt || video.uploaded_at)}</p>
                    </div>
                  </div>
                  {video.url && playingVideoUrl === video.url && (
                    <TrackedVideoPlayer
                      video={video}
                      autoPlay
                      className='mt-3 aspect-video w-full rounded-lg bg-black'
                      onViewCountChange={updateViewCount}
                    />
                  )}
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

        <RejectionReasonDialog
          selectedReason={selectedReason}
          onClose={() => setSelectedReason(null)}
        />

        <section className='rounded-xl border border-white/10 bg-[#0b1115] p-4'>
          <h2 className='border-b border-white/10 pb-3 text-sm font-semibold'>Quick links</h2>
          <div className='mt-1 divide-y divide-white/10'>
            {[
              { label: 'Submission Guidelines', to: '/my-account/specification', icon: FileVideo2 },
              { label: 'Enter Film Festival', to: '/contest', icon: FolderOpen },
            ].map(({ label, to, icon: Icon }) => (
              <Link key={to} to={to} className='flex min-h-12 items-center capitalize gap-3 text-xs text-gray-300 transition-colors hover:text-cyan-200'>
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
          <Link to='/contact' className='mt-4 inline-flex min-h-9 items-center rounded-md border border-cyan-300/50 px-3 text-xs font-medium text-cyan-200 hover:bg-cyan-300/10 capitalize'>Contact support</Link>
        </section>
      </aside>
    </div>
  )
}

export const MessagesScreen = () => {
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [messagesError, setMessagesError] = useState('')
  const [selectedReason, setSelectedReason] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessagesError('Sign in to view your submission notifications.')
      setLoadingMessages(false)
      return undefined
    }

    let isActive = true
    const loadMessages = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const response = await axios.post(API_ENDPOINTS.GET_USER_VIDEOS, {}, { headers })
        const notifications = (response.data?.result || [])
          .filter((video) => ['approved', 'rejected'].includes(video.submissionStatus) && video.reviewedAt)
          .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())

        if (isActive) setMessages(notifications)

        try {
          await axios.patch(API_ENDPOINTS.MARK_REVIEW_NOTIFICATIONS_READ, {}, { headers })
        } catch (error) {
          console.error('Failed to mark submission notifications as read:', error)
        }
      } catch (error) {
        console.error('Failed to load submission messages:', error)
        if (isActive) setMessagesError('Could not load your messages. Please try again.')
      } finally {
        if (isActive) setLoadingMessages(false)
      }
    }

    loadMessages()
    return () => { isActive = false }
  }, [])

  return (
    <div className='mx-auto max-w-3xl space-y-5'>
      <header>
        <p className='text-xs font-semibold uppercase tracking-wide text-cyan-300'>Inbox</p>
        <h1 className='mt-2 text-2xl font-semibold sm:text-3xl'>Messages</h1>
        <p className='mt-2 text-sm text-gray-400'>Updates about your film submissions.</p>
      </header>

      <section className='overflow-hidden rounded-xl border border-white/10 bg-[#0b1115]'>
        {loadingMessages ? (
          <p className='p-6 text-center text-sm text-gray-400'>Loading messages...</p>
        ) : messagesError ? (
          <p role='alert' className='p-6 text-center text-sm text-rose-300'>{messagesError}</p>
        ) : messages.length ? (
          <div className='divide-y divide-white/10'>
            {messages.map((video) => {
              const rejected = video.submissionStatus === 'rejected'
              const title = video.title || `Film submission #${video.id}`
              return (
                <article key={video.id} className='flex flex-col gap-3 p-5 sm:flex-row sm:items-start'>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    rejected ? 'bg-rose-400/10 text-rose-300' : 'bg-emerald-400/10 text-emerald-300'
                  }`}>
                    {rejected ? <CircleX size={19} /> : <CheckCircle2 size={19} />}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <h2 className={`text-sm font-semibold ${rejected ? 'text-rose-300' : 'text-emerald-300'}`}>
                        {rejected ? 'Film not approved' : 'Film approved'}
                      </h2>
                      <time className='text-xs text-gray-500' dateTime={video.reviewedAt}>
                        {formatSubmissionDate(video.reviewedAt)}
                      </time>
                    </div>
                    <p className='mt-1 text-sm text-white'>{title}</p>
                    <p className='mt-1 text-sm leading-6 text-gray-400'>
                      {rejected
                        ? 'Your film submission was not approved.'
                        : 'Good news! Your film submission has been approved.'}
                    </p>
                    {rejected && video.reviewReason && (
                      <div className='mt-3 rounded-lg border border-rose-300/10 bg-rose-300/[0.04] p-3'>
                        <p className='text-xs font-semibold text-rose-300'>Rejection reason</p>
                        <p className='mt-1 line-clamp-2 text-sm leading-5 text-gray-300'>
                          {video.reviewReason}
                        </p>
                        <button
                          type='button'
                          onClick={() => setSelectedReason({ title, reason: video.reviewReason })}
                          className='mt-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200'
                        >
                          View full reason
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className='flex flex-col items-center px-6 py-12 text-center'>
            <span className='flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300'><Mail size={25} /></span>
            <h2 className='mt-4 text-lg font-semibold'>No messages yet</h2>
            <p className='mt-2 max-w-md text-sm leading-6 text-gray-400'>Approval and rejection updates for your films will appear here.</p>
            <Link to='/contact' className='mt-5 inline-flex items-center gap-2 rounded-md border border-cyan-300/40 px-4 py-2.5 text-sm font-medium text-cyan-200 hover:bg-cyan-300/10'>Contact support <ArrowRight size={16} /></Link>
          </div>
        )}
      </section>
      <RejectionReasonDialog
        selectedReason={selectedReason}
        onClose={() => setSelectedReason(null)}
      />
    </div>
  )
}

export default DashboardOverview