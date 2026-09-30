import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/icons/logo.png'
import profileImg from '../assets/icons/profileicon.png'
import { FaOpencart } from 'react-icons/fa'
import { MdMenu, MdOutlineLogin } from 'react-icons/md'
import LoginModal from './LoginModal'
import ProfileModal from './ProfileModal'
import { CartContext } from '../constants/CartContext'

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
        name: 'Pricing',
        path: '/pricing'
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
    const [showModal, setShowModal] = useState(false)
    const [showNav, setShowNav] = useState(false)
    const user = localStorage.getItem('token');
    const { cart, totalAmount } = useContext(CartContext);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNav(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='w-full bg-[rgba(18,18,18,1)] text-white h-[106px] flex items-center px-16 lg:px-36 justify-between'>
            <Link to={'/'} className='flex items-center gap-2'>
                <div className='flex items-center'>
                    <img src={logo} alt="logo" className='w-7 aspect-square' />
                    <span className='ml-2 font-medium text-lg whitespace-nowrap'>PLACE MY FILMS</span>
                </div>
            </Link>
            <nav className='flex relative gap-10 items-center'>
                <ul ref={dropdownRef} className={`flex-col top-10 right-28 sm:right-12 md:right-0 md:top-0  w-max items-center md:flex-row absolute  bg-[#0A0A0A] md:bg-transparent z-[55] md:relative md:space-x-11 gap-3 md:gap-0 p-12 md:p-0 md:pt-2 ${showNav ? 'flex' : 'hidden md:flex'}`}>
                    {
                        routes.map((route, index) => (
                            <li key={index} className={`md:underline text-md hover:text-gray-500 hover:decoration-transparent ${pathname == route.path ? "decoration-transparent" : ""} transition-all duration-200`}>
                                <Link to={route.path} onClick={() => setShowNav(!showNav)}>{route.name}</Link>
                            </li>
                        ))
                    }
                </ul>
                <div className='flex gap-5'>
                    <MdMenu className={`cursor-pointer flex md:hidden`} size={30} onClick={() => setShowNav(!showNav)} />
                    <div className='relative'>
                        {
                            !user ? (
                                <>
                                    <MdOutlineLogin size={25} onClick={() => setShowModal(!showModal)} className='cursor-pointer' />
                                    {
                                        showModal && (
                                            <LoginModal showModal={showModal} setShowModal={setShowModal} />
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    <div className='w-8 overflow-hidden aspect-square rounded-full bg-white flex items-center justify-center cursor-pointer' onClick={() => setShowModal(!showModal)}>
                                        <img src={profileImg} alt="" />
                                    </div>
                                    {
                                        showModal && (
                                            <ProfileModal showModal={showModal} setShowModal={setShowModal} />
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                    <div className='flex relative'>
                        <Link to={'/cart'} className='flex relative'>
                            <FaOpencart size={30} />{cart.length > 0 && <span className='absolute -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center'>{cart.length}</span>}
                        </Link>
                        {totalAmount > 0 && <span
                            className='text-white px-2 py-1 rounded-md text-xl'
                        >${Number(totalAmount).toFixed(2)}</span>}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar