import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const Template = ({children}) => {
  const { pathname } = useLocation()
  const isAuthenticatedDashboard = pathname.startsWith('/my-account') && Boolean(localStorage.getItem('token'))
  const title = pathname === '/' ? 'PLACE MY FILMS - Take your filmmaking career to the next level!' : pathname.charAt(1).toUpperCase() + pathname.slice(2) + ' - PLACE MY FILMS'
  useEffect(() => {
    document.title = `${title}`
  }, [pathname])

  return (
    <div>
      <ToastContainer />
        {!isAuthenticatedDashboard && <Navbar />}
        {children}
        {!isAuthenticatedDashboard && <Footer />}
    </div>
  )
}

Template.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Template