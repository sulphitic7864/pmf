import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { jwtDecode } from 'jwt-decode';
import ReCAPTCHA from 'react-google-recaptcha';
import { API_ENDPOINTS } from '../server/api_endpoints';

const initialContactData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "LK", // Default country - Sri Lanka
    email: "",
    message: ""
};

// Function to get formatted country list
const getFormattedCountries = () => {
    return getCountries().map(country => ({
        code: country,
        dialCode: `+${getCountryCallingCode(country)}`,
        name: new Intl.DisplayNames(['en'], { type: 'region' }).of(country)
    })).sort((a, b) => a.name.localeCompare(b.name));
};

const Contactpage = () => {
    const [contactData, setContactData] = useState(initialContactData);
    const [error, setError] = useState(initialContactData);
    const [userID, setUserID] = useState(null);
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const countries = getFormattedCountries();
    const token = localStorage.getItem("token");

    // Decode token and set userID
    useEffect(() => {
        if (token === null) return;
        const decoded = jwtDecode(token);
        setUserID(decoded.UserId);
    }, []);

    // Fetch user email and update form
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await axios.get(
                    API_ENDPOINTS.GET_USER_DETAILS(userID),
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = response.data.result[0];
                
                setContactData(prevData => ({
                    ...prevData,
                    email: data.email ? data.email : ""
                }));
            } catch {
                console.log("Failed to fetch user details");
                toast.error('Failed to load user details');
            }
        };
        if (userID) {
            getUserDetails();
        }
    }, [userID]);

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email' && contactData.email) return;
        
        setContactData({ ...contactData, [name]: value });
        setError({
            ...error,
            [name]: ''
        });
    };

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };

    const validateField = () => {
        const error = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            message: '',
            recaptcha: ''
        };
        let isValid = true;

        if (contactData.firstName === '') {
            error.firstName = "First Name is required";
            isValid = false;
        }
        if (contactData.lastName === '') {
            error.lastName = "Last Name is required";
            isValid = false;
        }
        if (contactData.phoneNumber === '') {
            error.phoneNumber = "Phone Number is required";
            isValid = false;
        }
        if (contactData.phoneNumber.length < 6 || contactData.phoneNumber.length > 15) {
            error.phoneNumber = "Phone number must be between 6 and 15 characters";
            isValid = false;
        }
        if (contactData.email === '') {
            error.email = "Email is required";
            isValid = false;
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(contactData.email)) {
            error.email = "Invalid Email";
            isValid = false;
        }
        if (contactData.message === '') {
            error.message = "Message is required";
            isValid = false;
        }
        if (!recaptchaValue) {
            error.recaptcha = "Please verify that you are not a robot";
            isValid = false;
        }
        setError(error);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateField()) {
            try {
                const selectedCountry = countries.find(c => c.code === contactData.countryCode);
                const formattedData = {
                    ...contactData,
                    phoneNumber: `${selectedCountry.dialCode} ${contactData.phoneNumber}`,
                    userId: userID,
                    recaptchaToken: recaptchaValue
                };

                const response = await axios.post(API_ENDPOINTS.CONTACT_US, formattedData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.data.response_code === 200) {
                    toast.success(response.data.message);
                    setContactData(prevData => ({
                        ...initialContactData,
                        email: prevData.email
                    }));
                    // Reset reCAPTCHA
                    setRecaptchaValue(null);
                    window.grecaptcha?.reset();
                }
            } catch (error) {
                toast.error('Something went wrong');
            }
        }
    };

    return (
        <>
            <div className='w-full min-h-screen bg-black'>
                <div className='w-full h-[calc(50vh-106px)] relative bg-contact-banner bg-cover bg-center'>
                    <div className='absolute flex items-center pl-10 md:pl-24 w-full h-full z-50 top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
                        <h1 className='text-5xl md:text-[3.5rem] font-bold gradient-text'>Contact Us</h1>
                    </div>
                </div>
                <div className='w-full min-h-screen bg-black px-5 sm:px-10 md:px-28 lg:px-48 pt-8 pb-12'>
                    <h1 className='text-3xl gradient-text font-semibold'>For a zoom meeting contact us here...!</h1>
                    <p className='mt-5 mb-6 gradient-text'>Send us a message using our form below. We will get back to you within 24 hours. Thanks for visiting Place My Films!</p>
                    <form>
                        <div className='w-full max-w-5xl flex flex-col gap-4 text-white'>
                            <div className='flex flex-col sm:flex-row gap-4 sm:gap-5'>
                                <div className='w-full sm:w-1/2'>
                                    <input 
                                        type="text" 
                                        name='firstName' 
                                        value={contactData.firstName}
                                        placeholder='First Name' 
                                        className='w-full rounded-md border border-white/10 bg-[#242829] p-3 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400' 
                                        onChange={handleContactChange}
                                    />
                                    {error.firstName && <p className='text-red-500'>{error.firstName}</p>}
                                </div>
                                <div className='w-full sm:w-1/2'>
                                    <input 
                                        type="text" 
                                        name='lastName' 
                                        value={contactData.lastName}
                                        placeholder='Last Name' 
                                        className='w-full rounded-md border border-white/10 bg-[#242829] p-3 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400' 
                                        onChange={handleContactChange}
                                    />
                                    {error.lastName && <p className='text-red-500'>{error.lastName}</p>}
                                </div>
                            </div>
                            <div className='w-full flex gap-2'>
                                <div className='w-2/5 sm:w-1/4'>
                                    <select
                                        name='countryCode'
                                        value={contactData.countryCode}
                                        className='w-full rounded-md border border-white/10 bg-[#242829] p-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400'
                                        onChange={handleContactChange}
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.name} ({country.dialCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-3/5 sm:w-3/4'>
                                    <input 
                                        type="number" 
                                        name='phoneNumber' 
                                        value={contactData.phoneNumber}
                                        placeholder='Phone Number' 
                                        className='w-full rounded-md border border-white/10 bg-[#242829] p-3 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400' 
                                        onChange={handleContactChange}
                                    />
                                    {error.phoneNumber && <p className='text-red-500'>{error.phoneNumber}</p>}
                                </div>
                            </div>
                            <div className='w-full'>
                                <input 
                                    type="text" 
                                    name='email' 
                                    value={contactData.email}
                                    placeholder='Email' 
                                    className='w-full rounded-md border border-white/10 bg-[#242829] p-3 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 read-only:cursor-not-allowed read-only:opacity-70' 
                                    onChange={handleContactChange}
                                    readOnly={!!contactData.email}
                                />
                                {error.email && <p className='text-red-500'>{error.email}</p>}
                            </div>
                            <div className='w-full'>
                                <textarea 
                                    rows={6} 
                                    name='message' 
                                    value={contactData.message}
                                    placeholder='Questions & Comments' 
                                    className='w-full resize-y rounded-md border border-white/10 bg-[#242829] p-3 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400' 
                                    onChange={handleContactChange}
                                />
                                {error.message && <p className='text-red-500'>{error.message}</p>}
                            </div>
                            <div className='w-full'>
                                <ReCAPTCHA
                                    sitekey="6Lc2BtYqAAAAAOkDyJBuHrakKg2jdkgCW3nMg_Je"
                                    onChange={handleRecaptchaChange}
                                    theme="dark"
                                />
                                {error.recaptcha && <p className='text-red-500'>{error.recaptcha}</p>}
                            </div>
                            <div className='w-full'>
                                <button className='w-full sm:w-auto min-w-40 rounded-sm bg-gradient-to-b from-sky-500 to-[#00D0B8] px-6 py-3 text-sm uppercase text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-black' onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Contactpage;