import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const Template = ({children}) => {
  const { pathname } = useLocation()
  const title = pathname === '/' ? 'PLACE MY FILMS - Take your filmmaking career to the next level!' : pathname.charAt(1).toUpperCase() + pathname.slice(2) + ' - PLACE MY FILMS'
  useEffect(() => {
    document.title = `${title}`
  }, [pathname])

  return (
    <div>
      <ToastContainer />
        <Navbar />
        {children}
        <Footer />
    </div>
  )
}

export default Template