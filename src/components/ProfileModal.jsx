import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { FaAddressBook } from 'react-icons/fa'
import { GrClose, GrOrderedList } from 'react-icons/gr'
import { MdAccountBox, MdDashboard, MdMessage, MdPayment } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const navigationContent = [
    {
        name: 'Dashboard',
        icon: <MdDashboard/>,
        link: '/my-account/'
    },
    {
        name: 'Orders',
        icon: <GrOrderedList/>,
        link: '/my-account/orders'
    },
    // {
    //     name: 'Message',
    //     icon: <MdMessage/>,
    //     link: '/my-account/messages'
    // },
    {
        name: 'Address',
        icon: <FaAddressBook/>,
        link: '/my-account/edit-address'
    },
    {
        name: 'Payment history',
        icon: <MdPayment/>,
        link: '/my-account/payment-methods'
    },
    {
        name: 'Account details',
        icon: <MdAccountBox/>,
        link: '/my-account/edit-account'
    }
]

const ProfileModal = ({showModal,setShowModal}) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowModal(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    const handleLogout = () => {
      sessionStorage.clear();
      localStorage.clear();
      localStorage.removeItem('userid')
        localStorage.removeItem('token')
        navigate('/')
        setShowModal(false)
    }
      

  return (
    <>
    <div ref={dropdownRef} className='w-[19rem] absolute top-10 -right-36 sm:-right-0 min-h-96 z-[100] bg-black '>
        <div className="w-full bg-[#0A0A0A] h-auto">
        <div className='w-10 h-10 absolute right-3 top-3 cursor-pointer flex items-center justify-center hover:rotate-180 transition-all duration-300' onClick={()=>setShowModal(!showModal)}>
                        <GrClose className=' text-2xl' />
                    </div>
            <div className="flex h-auto flex-col p-10">
              {
                navigationContent.map((item, index) => (
                    <Link to={item.link} key={index} className={`text-white text-lg mb-4 hover:text-gray-400 flex gap-2 items-center`} onClick={()=>setShowModal(!showModal)}> {item.icon} <p>{item.name}</p></Link>
                ))
              }
            <hr className='border-gray-700 my-1' />
            <div className="text-white text-lg cursor-pointer mb-4 hover:text-gray-400 flex gap-2 items-center" onClick={handleLogout}><BiLogOut/> <p>Log out</p></div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ProfileModal