import React, { useEffect,useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Template from './components/Template'
import Homepage from './pages/Homepage'
import Aboutpage from './pages/Aboutpage'
import Pricingpage from './pages/Pricingpage'
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
const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (packageItem) => {
    setCart([...cart, packageItem]);
  };
  return (

    <CartProvider>
    <Router>
        <Routes>
            <Route path="/" element={<Template><Homepage/></Template>} />
            <Route path="/about" element={<Template><Aboutpage/></Template>} />
            <Route path="/contest" element={<Template><Contestpage/></Template>} />
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