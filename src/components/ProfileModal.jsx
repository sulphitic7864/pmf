import { useEffect, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'
import { MdDashboard } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

const ProfileModal = ({ setShowModal }) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowModal(false);
            }
        }
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setShowModal(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [setShowModal])

    const handleLogout = () => {
        sessionStorage.clear()
        localStorage.clear()
        localStorage.removeItem('token')
        navigate('/')
        setShowModal(false)
    }

    return (
        <div
            ref={dropdownRef}
            className='absolute right-0 top-[calc(100%+0.85rem)] z-[100] w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1115]/[0.98] text-white shadow-[0_22px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl'
        >
            <div aria-hidden='true' className='h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300' />
            <div className='flex items-start justify-between border-b border-white/[0.07] px-5 py-4'>
                <div>
                    <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80'>Account</p>
                    <p className='mt-1 text-sm text-white/55'>Your filmmaking space</p>
                </div>
                <button
                    type='button'
                    aria-label='Close account menu'
                    onClick={() => setShowModal(false)}
                    className='flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300'
                >
                    <GrClose className='text-sm' />
                </button>
            </div>

            <div className='space-y-1 p-2.5'>
                <Link
                    to='/my-account/'
                    onClick={() => setShowModal(false)}
                    className='group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/85 transition-colors hover:bg-cyan-300/[0.09] hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-300'
                >
                    <span className='flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-200 transition-colors group-hover:border-cyan-300/30 group-hover:bg-cyan-300/[0.12]'>
                        <MdDashboard size={19} />
                    </span>
                    <span className='flex-1'>Dashboard</span>
                    <span aria-hidden='true' className='text-lg text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-200'>›</span>
                </Link>
                <button
                    type='button'
                    onClick={handleLogout}
                    className='group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-white/65 transition-colors hover:bg-rose-400/[0.08] hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-300'
                >
                    <span className='flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/55 transition-colors group-hover:border-rose-300/15 group-hover:bg-rose-300/[0.08] group-hover:text-rose-200'>
                        <BiLogOut size={19} />
                    </span>
                    <span>Log out</span>
                </button>
            </div>
        </div>
    )
}

export default ProfileModal