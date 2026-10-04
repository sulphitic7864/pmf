import { Link, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CircleHelp, CreditCard, FileText, House, LogOut, Mail, MapPin, PanelLeftClose, PanelLeftOpen, Settings, UploadCloud } from 'lucide-react'
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

const SideBar = ({ collapsed = false, hidePromo = false, hideLogout = false, hideToggle = false, onToggle, onLogout }) => {
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
                title={collapsed ? name : undefined}
                aria-label={collapsed ? name : undefined}
                className={`group flex min-h-11 items-center rounded-r-lg border-l-[3px] text-sm transition-colors ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive ? 'border-cyan-400 bg-gradient-to-r from-cyan-400/15 to-transparent text-cyan-200' : 'border-transparent text-gray-300 hover:bg-white/[0.04] hover:text-white'}`}
            >
                <Icon size={18} className={isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-cyan-300'} />
                <span className={collapsed ? 'sr-only' : ''}>{name}</span>
            </Link>
        )
    })

    return (
        <div className={`scrollbar-hidden flex h-full flex-col overflow-y-auto ${collapsed ? 'px-2' : 'px-3'} py-5 ${hideLogout ? 'pb-24' : ''}`}>
            {!hideToggle && <div className={`mb-5 flex ${collapsed ? 'justify-center' : 'justify-end px-2'}`}>
                <button
                    type='button'
                    aria-label={collapsed ? 'Expand sidebar labels' : 'Collapse sidebar labels'}
                    aria-pressed={collapsed}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    onClick={onToggle}
                    className='flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                >
                    {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>}
            {!collapsed && <p className='mb-3 px-3 text-[10px] font-semibold uppercase text-gray-500'>Workspace</p>}
            <nav aria-label='Creator workspace' className='flex flex-col gap-1'>
                {renderNavigation(navigationContent)}
            </nav>
            {!collapsed && <p className='mb-3 mt-7 px-3 text-[10px] font-semibold uppercase text-gray-500'>Account</p>}
            <nav aria-label='Account settings' className='flex flex-col gap-1'>
                {renderNavigation(accountContent)}
            </nav>
            <Link to='/contact' title={collapsed ? 'Help & Support' : undefined} aria-label={collapsed ? 'Help & Support' : undefined} className={`mt-1 flex min-h-11 items-center rounded-r-lg border-l-[3px] border-transparent text-sm text-gray-300 transition-colors hover:bg-white/[0.04] hover:text-white ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}>
                <CircleHelp size={18} className='text-gray-400' />
                <span className={collapsed ? 'sr-only' : ''}>Help & Support</span>
            </Link>
            {!hidePromo && !collapsed && (
                <div className='mt-auto hidden pt-6 md:block'>
                    <img src={dashboardBanner} alt='Your story belongs here' className='mx-auto aspect-[0.58] max-h-64 w-full rounded-sm object-cover object-center' />
                    <p className='mt-3 text-center text-[10px] uppercase text-gray-500'>Film · TV · Streaming · Global</p>
                </div>
            )}
            {!hideLogout && <div className='sticky bottom-0 z-10 mt-auto border-t border-white/10 bg-[#080d10] pb-4 pt-3 md:border-0 md:bg-transparent md:pb-0'>
                <button type='button' title={collapsed ? 'Log out' : undefined} aria-label={collapsed ? 'Log out' : undefined} onClick={handleLogout} className={`flex min-h-11 w-full items-center rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 md:justify-start md:rounded-r-lg md:rounded-l-none md:border-l-[3px] md:border-transparent md:bg-none md:text-gray-300 md:hover:bg-white/[0.04] md:hover:text-rose-300 ${collapsed ? 'justify-center px-0' : 'justify-center gap-2 px-4 md:gap-3 md:px-3'}`}>
                    <LogOut size={18} className='md:text-gray-400' />
                    <span className={collapsed ? 'sr-only' : ''}>Log out</span>
                </button>
            </div>}
        </div>
    )
}

SideBar.propTypes = {
    collapsed: PropTypes.bool,
    hidePromo: PropTypes.bool,
    hideLogout: PropTypes.bool,
    hideToggle: PropTypes.bool,
    onToggle: PropTypes.func,
    onLogout: PropTypes.func,
}

export default SideBar