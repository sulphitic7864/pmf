import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  Elements,
  CardElement,
  LinkAuthenticationElement,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { Country, State }  from 'country-state-city';
import axios from "axios";
import { div } from "framer-motion/client";
import { FaSpinner } from "react-icons/fa";
import { BsDot, BsThreeDots } from "react-icons/bs";

import CheckoutForm from '../components/CheckoutForm'
import { API_ENDPOINTS } from '../server/api_endpoints'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const initialCheckoutDetails = {
  firstName: "",
  lastName: "",
  companyName: "",
  country: "US",
  streetAddress: "",
  apartment: "",
  city: "",
  state: "SC",
  zipCode: "",
  phone: "",
  email: "",
  username: "",
  orderNotes: "",
};

// Checkout Page Component
const CheckoutPage = () => {
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(initialCheckoutDetails);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
      const fetchCountries = () => {
        const getcountries = Country.getAllCountries();
        setCountries(getcountries);
      }
      fetchCountries();
    }, []);

    useEffect(() => {
      const fetchStates = () => {
        const getstates = State.getStatesOfCountry(paymentDetails.country);
        setStates(getstates);
      }
      fetchStates();
    }, [paymentDetails.country]);

    useEffect(() => {
      
        fetch(API_ENDPOINTS.PAY_STRIPE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1000,currency:"usd"}),
        })
        .then((response) => response.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => console.error("Error fetching clientSecret:", error));
    }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
    loader: "auto",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  }

return (
  <div className="w-full flex flex-col md:flex-row min-h-screen bg-black px-20 lg:px-44 gap-10 pt-16 text-white">
    <div className="w-full md:w-1/2">
      <form className="space-y-4">
        <h3 className="text-3xl font-semibold">Billing details</h3>
        <div className="flex w-full gap-2">
          <div className="flex flex-col gap-2 w-full">
            <label className="block">First name *</label>
            <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="firstName" required onChange={handleInputChange} />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="block">Last name *</label>
            <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="lastName" required onChange={handleInputChange} />
          </div>
        </div>
        
        <label className="block">Company name (optional)</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="companyName" onChange={handleInputChange} />
        
        <label className="block">Country / Region *</label>
        <select className="w-full p-2 border bg-[#333] border-gray-900 rounded" name="country" required onChange={handleInputChange}>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
        
        <label className="block">Street address *</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="streetAddress" required onChange={handleInputChange} />
        
        <label className="block">Apartment, suite, unit, etc. (optional)</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="apartment" onChange={handleInputChange} />
        
        <label className="block">Town / City *</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="city" required onChange={handleInputChange} />
        
        <label className="block">State *</label>
        <select className="w-full p-2 border bg-[#333] border-gray-900 rounded" name="state" required onChange={handleInputChange}>
          {states.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
        
        <label className="block">ZIP Code *</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="zipCode" required onChange={handleInputChange} />
        
        <label className="block">Phone *</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="tel" name="phone" required onChange={handleInputChange} />
        
        <label className="block">Email address *</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="email" name="email" required onChange={handleInputChange} />
        
        <label className="block">Account username *</label>
        <input className="w-full p-2 border bg-[#333] border-gray-900 rounded" type="text" name="username" required onChange={handleInputChange} />
        
        <h1 className="text-3xl font-semibold">Additional information</h1>
        <label className="block">Order notes (optional)</label>
        <textarea rows={6} className="w-full p-2 border bg-[#333] border-gray-900 rounded" name="orderNotes" placeholder="Notes about your order, e.g. special notes for delivery." onChange={handleInputChange}></textarea>
      </form>
    </div>
    <div className="w-full md:w-1/2">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm paymentDetails={paymentDetails} clientsecret={clientSecret} CardElement={CardElement}/>
        </Elements>
      )}
     {!clientSecret && (
        <div className="flex flex-col gap-2 justify-center items-center h-1/2">
          <FaSpinner className="animate-spin text-4xl" />
          <p>Loading stripe form . . .</p>
        </div>
      )}
    </div>
  </div>
);
};



export default CheckoutPage;
