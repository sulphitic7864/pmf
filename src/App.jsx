import './App.css'
import { BrowserRouter as Router,Routes,Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Template from './components/Template'
import Homepage from './pages/Homepage'
import Aboutpage from './pages/Aboutpage'
import Blogpage from './pages/Blogpage'
import Contactpage from './pages/Contactpage'
import CartPage from './pages/CartPage'
import PackageProducts from './pages/PackageProducts'
import CheckoutPage from './pages/paymentpage'
import MyAccount from './pages/MyAccount'
import SuccessPage from './pages/Success'
import { CartProvider } from './constants/CartContext';
import BlogView from './pages/BlogView'
import Specifications from './pages/Specifications'
import Contestpage from './pages/Contestpage'
import OnboardingCheckoutPage from './pages/OnboardingCheckoutPage'
import SubmitFilmRoute from './pages/SubmitFilmRoute'
import { SESSION_EXPIRED_EVENT } from './server/authSession'

const SessionExpiryRedirect = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const handleSessionExpired = (event) => {
            navigate('/my-account/', {
                replace: true,
                state: {
                    sessionExpired: true,
                    returnTo: event.detail?.returnTo,
                },
            })
        }

        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }, [navigate])

    return null
}

const App = () => {
  return (

    <CartProvider>
    <Router>
        <SessionExpiryRedirect />
        <Routes>
            <Route path="/" element={<Template><Homepage/></Template>} />
            <Route path="/about" element={<Template><Aboutpage/></Template>} />
            <Route path="/contest" element={<Template><Contestpage/></Template>} />
            <Route path="/onboarding" element={<Template><OnboardingCheckoutPage/></Template>} />
            <Route path="/submit-film" element={<Template><SubmitFilmRoute/></Template>} />
            {/* <Route path="/contest" element={<Template><Pricingpage/></Template>} /> */}
            <Route path="/product/:packageid" element={<Template><PackageProducts/></Template>} />
            <Route path="/blog" element={<Template><Blogpage/></Template>} />
            <Route path="/blog/view/:id" element={<Template><BlogView/></Template>}/>
            <Route path="/contact" element={<Template><Contactpage/></Template>} />
            <Route path="/cart" element={<Template><CartPage/></Template>} />
            <Route path="/checkout" element={<Template><CheckoutPage/></Template>} />
            <Route path="/my-account/" element={<Template><MyAccount/></Template>} />
            <Route path="/my-account/:param" element={<Template><MyAccount/></Template>} />
            <Route path="/success" element={<Template><SuccessPage/></Template>} />
            <Route path='/specification' element={<Template><Specifications/></Template>}/>
        </Routes>
    </Router>
    </CartProvider>

  )
}

export default App