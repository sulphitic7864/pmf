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
        name: 'Contest',
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
            <header className={`sticky top-0 z-[60] flex w-full items-center justify-between px-5 text-white transition-all duration-300 ease-in-out sm:px-8 md:px-12 lg:px-36 ${isScrolled ? 'h-[75px] bg-[rgba(18,18,18,0.88)] shadow-md backdrop-blur-sm' : 'h-[106px] bg-[rgba(18,18,18,1)]'}`}>
                <Link to='/' className='flex items-center gap-2' onClick={() => setShowNav(false)}>
                    <img src={logo} alt="logo" className='w-7 aspect-square' />
                    <span className='ml-2 whitespace-nowrap text-lg font-medium'>PLACE MY FILMS</span>
                </Link>
                <nav className='flex items-center gap-5'>
                    <ul className='hidden items-center gap-6 md:flex lg:gap-8'>
                        {routes.map((route) => (
                            <li key={route.path} className={`text-md transition-colors duration-200 hover:text-gray-400 ${pathname === route.path ? 'underline underline-offset-4' : ''}`}>
                                <Link to={route.path}>{route.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <button
                        type='button'
                        aria-label={showNav ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={showNav}
                        onClick={() => setShowNav((open) => !open)}
                        className='flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 md:hidden'
                    >
                        <MdMenu size={28} />
                    </button>
                    <div className='relative hidden md:block'>
                        {!user ? (
                            <>
                                <MdOutlineLogin size={25} onClick={() => setShowModal(!showModal)} className='cursor-pointer' />
                                {showModal && <LoginModal showModal={showModal} setShowModal={setShowModal} />}
                            </>
                        ) : (
                            <>
                                <div className='flex aspect-square w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white' onClick={() => setShowModal(!showModal)}>
                                    <img src={profileImg} alt="" />
                                </div>
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
                className={`fixed right-0 top-0 z-[80] flex h-screen w-[min(88vw,22rem)] flex-col border-l border-white/10 bg-[#101314] text-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${showNav ? 'translate-x-0' : 'translate-x-full'}`}
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
                        className='flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
                    >
                        <MdClose size={25} />
                    </button>
                </div>

                <nav aria-label='Mobile navigation links' className='flex flex-col gap-2 px-4 py-6'>
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            onClick={() => setShowNav(false)}
                            className={`flex min-h-12 items-center justify-between rounded-lg px-4 text-base transition-colors hover:bg-white/[0.06] hover:text-cyan-200 ${pathname === route.path ? 'bg-cyan-400/10 text-cyan-300' : 'text-gray-200'}`}
                        >
                            {route.name}
                            <span aria-hidden='true' className='text-gray-500'>›</span>
                        </Link>
                    ))}
                </nav>

                <div className='mt-auto border-t border-white/10 p-5'>
                    {user ? (
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
                        >
                            <MdLogout size={20} />
                            Log out
                        </button>
                    ) : (
                        <Link
                            to='/my-account/'
                            onClick={() => setShowNav(false)}
                            className='flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300'
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