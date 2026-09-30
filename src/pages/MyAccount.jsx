import React from 'react'
import LoginAndSignUp from '../components/LoginAndSignup'
import Dashboard from './Dashboard'
import { useLocation } from 'react-router-dom'
import RecoverPassword from './RecoverPassword'

const MyAccount = () => {
    const user = localStorage.getItem('token')
    const {pathname} = useLocation()
  return (
    <div>
        {
            user ? <Dashboard/> : pathname === '/my-account/lost-password/' ? <RecoverPassword/> : <LoginAndSignUp />
        }

    </div>
  )
}

export default MyAccount