import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { FaAddressBook } from 'react-icons/fa'
import { GrOrderedList } from 'react-icons/gr'
import { MdAccountBox, MdDashboard, MdMessage, MdPayment } from 'react-icons/md'
import { Link, useLocation, useNavigate } from 'react-router-dom'

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

const SideBar = ({setShowSidebar}) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        localStorage.removeItem('userid')
        localStorage.removeItem('token')
        navigate('/')
        
    }
return (
    <div>
        <div className="w-full bg-[#0A0A0A] h-auto absolute md:relative z-50">
                <div className="flex w-max h-auto flex-col pl-10 xl:pl-16 py-10 pr-8 mt-10">
                    {
                        navigationContent.map((item, index) => (
                            <Link to={item.link} key={index} className={`text-white text-lg mb-4 hover:text-gray-400 flex gap-2 items-center ${pathname === item.link ? 'bg-[#121212] p-2 rounded-sm' : ''}`}
                            onClick={()=>setShowSidebar(false)}
                            > {item.icon} <p>{item.name}</p></Link>
                        ))
                    }
                <hr className='border-gray-700 my-1' />
                <div className="text-white cursor-pointer text-lg mb-4 hover:text-gray-400 flex gap-2 items-center" onClick={handleLogout}><BiLogOut/> <p>Log out</p></div>
                </div>
        </div>
    </div>
)
}

export default SideBar