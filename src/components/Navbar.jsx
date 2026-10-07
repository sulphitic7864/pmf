import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/icons/logo.png'
import profileImg from '../assets/icons/profileicon.png'
import { MdClose, MdLogout, MdMenu, MdOutlineLogin } from 'react-icons/md'
import LoginModal from './LoginModal'
import ProfileModal from './ProfileModal'

const routes = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'About Us',
        path: '/about'
    },
    {
        name: 'Film Festivals',
        path: '/contest'
    },
    {
        name: 'Blog',
        path: '/blog'
    },
    {
        name: 'Contact Us',
        path: '/contact'
    }
]

const Navbar = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showNav, setShowNav] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const user = localStorage.getItem('token');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled((scrolled) => window.scrollY > (scrolled ? 20 : 80))
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (!showNav) return

        const previousOverflow = document.body.style.overflow
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setShowNav(false)
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        };
    }, [showNav]);

    const handleLogout = () => {
        sessionStorage.clear()
        localStorage.clear()
        navigate('/')
        setShowNav(false)
    }

    return (
        <>
            <header className={`sticky top-0 z-[60] flex w-full items-center justify-between border-b border-white/[0.06] px-5 text-white transition-all duration-300 ease-in-out sm:px-8 md:px-10 lg:px-16 xl:px-24 ${isScrolled ? 'h-[72px] bg-[#080d10]/95 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl' : 'h-[88px] bg-[#080d10]'}`}>
                <Link to='/' aria-label='Place My Films home' className='group flex shrink-0 items-center gap-2.5' onClick={() => setShowNav(false)}>
                    <span className='flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-white/[0.04] transition-colors group-hover:border-cyan-300/35 group-hover:bg-cyan-300/[0.08]'>
                        <img src={logo} alt="" className='aspect-square w-7 object-contain' />
                    </span>
                    <span className='whitespace-nowrap text-[1.05rem] font-extrabold tracking-[-0.045em] sm:text-xl'>
                        PLACE <span className='text-white'>MY FILMS</span>
                    </span>
                </Link>
                <nav aria-label='Main navigation' className='flex items-center gap-3 sm:gap-5'>
                    <ul className='hidden items-center gap-1 md:flex'>
                        {routes.map((route) => (
                            <li key={route.path}>
                                <Link
                                    to={route.path}
                                    aria-current={pathname === route.path ? 'page' : undefined}
                                    className={`relative flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 lg:px-4 ${pathname === route.path ? 'bg-cyan-300/[0.09] text-cyan-200' : 'text-white/70 hover:bg-white/[0.05] hover:text-white'}`}
                                >
                                    {route.name}
                                    {pathname === route.path && <span aria-hidden='true' className='absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-teal-300' />}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button
                        type='button'
                        aria-label={showNav ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={showNav}
                        onClick={() => setShowNav((open) => !open)}
                        className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/85 transition-colors hover:border-cyan-300/30 hover:bg-cyan-300/[0.08] hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 md:hidden'
                    >
                        <MdMenu size={28} />
                    </button>
                    <div className='relative hidden md:block'>
                        {!user ? (
                            <>
                                <button
                                    type='button'
                                    aria-label='Log in'
                                    onClick={() => setShowModal(!showModal)}
                                    className='flex min-h-10 items-center gap-2 rounded-full border border-cyan-300/45 bg-cyan-300/[0.06] px-4 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/[0.13] focus:outline-none focus:ring-2 focus:ring-cyan-300'
                                >
                                    <MdOutlineLogin size={19} />
                                    <span>Log in</span>
                                </button>
                                {showModal && <LoginModal showModal={showModal} setShowModal={setShowModal} />}
                            </>
                        ) : (
                            <>
                                <button
                                    type='button'
                                    aria-label='Open account menu'
                                    aria-expanded={showModal}
                                    onClick={() => setShowModal(!showModal)}
                                    className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-300/20 to-teal-300/10 p-0.5 transition-shadow hover:shadow-[0_0_18px_rgba(34,211,238,0.22)] focus:outline-none focus:ring-2 focus:ring-cyan-300'
                                >
                                    <img src={profileImg} alt="" className='h-full w-full rounded-full object-cover' />
                                </button>
                                {showModal && <ProfileModal showModal={showModal} setShowModal={setShowModal} />}
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <div
                aria-hidden='true'
                onClick={() => setShowNav(false)}
                className={`fixed inset-0 z-[70] bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${showNav ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />
            <aside
                role='dialog'
                aria-modal='true'
                aria-label='Mobile navigation'
                aria-hidden={!showNav}
                inert={!showNav ? '' : undefined}
                className={`fixed right-0 top-0 z-[80] flex h-screen h-[100dvh] max-h-[100dvh] w-[min(88vw,22rem)] flex-col overflow-y-auto overscroll-contain border-l border-white/10 bg-[#0b1115] text-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${showNav ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className='flex h-[75px] shrink-0 items-center justify-between border-b border-white/10 px-5'>
                    <Link to='/' className='flex items-center gap-2' onClick={() => setShowNav(false)}>
                        <img src={logo} alt="" className='w-7 aspect-square' />
                        <span className='whitespace-nowrap text-base font-semibold'>PLACE MY FILMS</span>
                    </Link>
                    <button
                        type='button'
                        aria-label='Close navigation menu'
                        onClick={() => setShowNav(false)}
                        className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
                    >
                        <MdClose size={25} />
                    </button>
                </div>

                <nav aria-label='Mobile navigation links' className='flex shrink-0 flex-col gap-2 px-4 py-6'>
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            onClick={() => setShowNav(false)}
                            aria-current={pathname === route.path ? 'page' : undefined}
                            className={`flex min-h-12 items-center justify-between rounded-xl border px-4 text-base transition-colors hover:bg-white/[0.06] hover:text-cyan-200 ${pathname === route.path ? 'border-cyan-300/20 bg-cyan-400/10 text-cyan-200' : 'border-transparent text-gray-200'}`}
                        >
                            {route.name}
                            <span aria-hidden='true' className='text-gray-500'>›</span>
                        </Link>
                    ))}
                </nav>

                <div className='sticky bottom-0 z-10 mt-auto shrink-0 border-t border-white/10 bg-[#101314] p-4 sm:p-5'>
                    {user ? (
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
                        >
                            <MdLogout size={20} />
                            Log out
                        </button>
                    ) : (
                        <Link
                            to='/my-account/'
                            onClick={() => setShowNav(false)}
                            className='flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
                        >
                            <MdOutlineLogin size={20} />
                            Login
                        </Link>
                    )}
                </div>
            </aside>
        </>
    )
}

export default Navbar