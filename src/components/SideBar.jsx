import { Link, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CircleHelp, CreditCard, FileText, House, LogOut, Mail, MapPin, Settings, UploadCloud } from 'lucide-react'
import dashboardBanner from '../assets/images/dashbaord_side_banner.png'

const navigationContent = [
    { name: 'Dashboard', icon: House, link: '/my-account/' },
    { name: 'New Submission', icon: UploadCloud, link: '/my-account/orders' },
    { name: 'My Submissions', icon: FileText, link: '/my-account/submissions' },
    { name: 'Messages', icon: Mail, link: '/my-account/messages' },
]

const accountContent = [
    { name: 'Account Settings', icon: Settings, link: '/my-account/edit-account' },
    { name: 'Billing Address', icon: MapPin, link: '/my-account/edit-address' },
    { name: 'Payment History', icon: CreditCard, link: '/my-account/payment-methods' },
]

const SideBar = ({ hidePromo = false, hideLogout = false, onLogout }) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleLogout = () => {
        if (onLogout) {
            onLogout()
            return
        }
        sessionStorage.clear()
        localStorage.clear()
        navigate('/')
    }

    const renderNavigation = (items) => items.map(({ name, icon: Icon, link }) => {
        const isActive = pathname === link
        return (
            <Link
                key={link}
                to={link}
                className={`group flex min-h-11 items-center gap-3 rounded-r-lg border-l-[3px] px-3 text-sm transition-colors ${isActive ? 'border-cyan-400 bg-gradient-to-r from-cyan-400/15 to-transparent text-cyan-200' : 'border-transparent text-gray-300 hover:bg-white/[0.04] hover:text-white'}`}
            >
                <Icon size={18} className={isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-cyan-300'} />
                <span>{name}</span>
            </Link>
        )
    })

    return (
        <div className={`flex h-full flex-col overflow-y-auto px-3 py-5 ${hideLogout ? 'pb-24' : ''}`}>
            <p className='mb-3 px-3 text-[10px] font-semibold uppercase text-gray-500'>Workspace</p>
            <nav aria-label='Creator workspace' className='flex flex-col gap-1'>
                {renderNavigation(navigationContent)}
            </nav>
            <p className='mb-3 mt-7 px-3 text-[10px] font-semibold uppercase text-gray-500'>Account</p>
            <nav aria-label='Account settings' className='flex flex-col gap-1'>
                {renderNavigation(accountContent)}
            </nav>
            <Link to='/contact' className='mt-1 flex min-h-11 items-center gap-3 rounded-r-lg border-l-[3px] border-transparent px-3 text-sm text-gray-300 transition-colors hover:bg-white/[0.04] hover:text-white'>
                <CircleHelp size={18} className='text-gray-400' />
                Help & Support
            </Link>
            {!hidePromo && (
                <div className='mt-auto hidden pt-6 md:block'>
                    <img src={dashboardBanner} alt='Your story belongs here' className='mx-auto aspect-[0.58] max-h-64 w-full rounded-sm object-cover object-center' />
                    <p className='mt-3 text-center text-[10px] uppercase text-gray-500'>Film · TV · Streaming · Global</p>
                </div>
            )}
            {!hideLogout && <div className='sticky bottom-0 z-10 mt-auto border-t border-white/10 bg-[#080d10] pb-4 pt-3 md:border-0 md:bg-transparent md:pb-0'>
                <button type='button' onClick={handleLogout} className='flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 md:justify-start md:rounded-r-lg md:rounded-l-none md:border-l-[3px] md:border-transparent md:bg-none md:px-3 md:text-gray-300 md:hover:bg-white/[0.04] md:hover:text-rose-300'>
                    <LogOut size={18} className='md:text-gray-400' />
                    Log out
                </button>
            </div>}
        </div>
    )
}

SideBar.propTypes = {
    hidePromo: PropTypes.bool,
    hideLogout: PropTypes.bool,
    onLogout: PropTypes.func,
}

export default SideBar