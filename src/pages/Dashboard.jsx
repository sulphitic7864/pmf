import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, X } from 'lucide-react'
import logo from '../assets/icons/logo.png'
import SideBar from '../components/SideBar'
import DashboardComponents from '../components/DashboardComponents'

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const navigate = useNavigate()

  const handleMobileLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    setShowSidebar(false)
    navigate('/')
  }

  return (
    <div className='min-h-screen bg-[#05090c] text-white'>
      <header className='sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#080d10]/95 px-4 backdrop-blur sm:px-6 lg:px-8'>
        <div className='flex min-w-0 items-center gap-3'>
          <button
            type='button'
            aria-label={showSidebar ? 'Close dashboard navigation' : 'Open dashboard navigation'}
            aria-expanded={showSidebar}
            onClick={() => setShowSidebar((open) => !open)}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-300 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 md:hidden'
          >
            {showSidebar ? <X size={21} /> : <Menu size={22} />}
          </button>
          <Link to='/my-account/' className='flex min-w-0 items-center gap-2'>
            <img src={logo} alt='' className='h-8 w-8 object-contain' />
            <span className='truncate text-sm font-bold tracking-wide sm:text-base'>PLACE MY FILMS</span>
            <span className='hidden border-l border-white/15 pl-3 text-xs text-gray-400 sm:inline'>CREATOR STUDIO</span>
          </Link>
        </div>
        <div className='flex items-center gap-3 sm:gap-5'>
          <Link to='/my-account/messages' aria-label='Open messages' className='relative flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-white/5 hover:text-cyan-300'>
            <Bell size={19} />
          </Link>
          <div className='hidden h-8 border-l border-white/15 sm:block' />
          <div className='flex items-center gap-2.5'>
            <span className='flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-sm font-semibold text-cyan-200'>
              PF
            </span>
            <div className='hidden sm:block'>
              <p className='text-xs text-gray-400'>Filmmaker</p>
              <p className='max-w-32 truncate text-sm font-medium'>My account</p>
            </div>
          </div>
        </div>
      </header>

      <div className='flex min-h-[calc(100vh-4rem)] w-full max-w-[1600px]'>
        <aside className={`sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 border-r border-white/10 bg-[#080d10] transition-[width] duration-200 md:block ${sidebarCollapsed ? 'w-[5rem]' : 'w-60'}`}>
          <SideBar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)} />
        </aside>

        {showSidebar && (
          <div className='fixed inset-0 top-16 z-40 bg-black/70 md:hidden' onClick={() => setShowSidebar(false)}>
            <aside
              className='relative h-full w-[min(84vw,18rem)] overflow-hidden border-r border-white/10 bg-[#080d10] shadow-2xl'
              onClick={(event) => {
                if (event.target.closest('a')) setShowSidebar(false)
                event.stopPropagation()
              }}
            >
              <SideBar hidePromo hideLogout hideToggle onLogout={handleMobileLogout} />
              <div className='absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-[#080d10] p-4'>
                <button
                  type='button'
                  onClick={handleMobileLogout}
                  className='flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className='min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7'>
          <DashboardComponents />
        </main>
      </div>
    </div>
  )
}

export default Dashboard