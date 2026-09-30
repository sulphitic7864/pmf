import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const initialLoginData = {loginemail: '', loginpassword: ''}
const initialSignupData = {signupemail: '', username: '', firstName: '', lastName: ''}

const LoginAndSignUp = () => {
    const [loginData, setLoginData] = useState(initialLoginData);
    const [signupData, setSignupData] = useState(initialSignupData);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    }

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.id]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loginData.loginemail === '' || loginData.loginpassword === '' ) {
            toast.error('Please fill in all fields');
            return;
        }
        
        setLoading(true);
        try {
            const requestBody = {
                usernameOrEmail: loginData.loginemail,
                password: loginData.loginpassword
            }
            const response = await axios.post(API_ENDPOINTS.LOGIN, 
                requestBody,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.data.response_code === 200) {
                localStorage.setItem('token', response.data.result.token);
                localStorage.setItem('userid', response.data.result.userId);
                
                // Check if there are stored firstName and lastName to update
                const tempFirstName = localStorage.getItem('tempFirstName');
                const tempLastName = localStorage.getItem('tempLastName');
                
                if (tempFirstName && tempLastName) {
                    // Update user profile with stored first name and last name
                    await updateUserProfile(response.data.result.token, response.data.result.userId, tempFirstName, tempLastName);
                    
                    // Clear temporary storage
                    localStorage.removeItem('tempFirstName');
                    localStorage.removeItem('tempLastName');
                }
                
                toast.success(response.data.message);
                setLoginData(initialLoginData);
                setTimeout(() => {
                    navigate('/my-account/');
                    window.location.reload();
                }, 3000);
            }
        } catch(error) {
            toast.error('Invalid login credentials');
        } finally {
            setLoading(false);
        }
    }

    const updateUserProfile = async (token, userId, firstName, lastName) => {
        try {
            const requestBody = {
                firstName: firstName,
                lastName: lastName,
            };
            
            await axios.put(
                API_ENDPOINTS.UPDATE_USER_DETAILS + `/${userId}`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            console.log('User profile updated with first name and last name');
        } catch (error) {
            console.error('Failed to update user profile:', error);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (signupData.signupemail === '' || signupData.username === '' || signupData.firstName === '' || signupData.lastName === '') {
            toast.error('Please fill in all fields');
            return;
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(signupData.signupemail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Register the user first (email and username only)
            const registerRequestBody = {
                email: signupData.signupemail,
                username: signupData.username
            }
            
            const registerResponse = await axios.post(
                API_ENDPOINTS.REGISTER, 
                registerRequestBody,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (registerResponse.data.response_code === 201) {
                // Store firstName and lastName in localStorage for later update
                localStorage.setItem('tempFirstName', signupData.firstName);
                localStorage.setItem('tempLastName', signupData.lastName);
                
                toast.success('Registration successful! Login details sent to your email.');
                setSignupData(initialSignupData);
            }
        } catch(error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        <div className='min-h-screen px-5 sm:px-20 md:px-32 lg:px-44 py-10 w-full bg-black'>
            <h1 className='text-4xl text-white'>Account</h1>
            <div className='flex items-center text-white justify-center mt-10'>
                <div className='w-full max-w-6xl flex flex-col md:flex-row'>
                    <div className='w-full md:w-1/2 flex flex-col p-8 rounded-l-lg md:border-r-[1px] border-solid border-gray-600 '>
                        <h2 className='text-2xl font-bold mb-6'>Login</h2>
                        <form>
                            <div className='mb-4'>
                                <label className='block text-white text-sm font-bold mb-2' htmlFor='loginemail'>
                                    Username or Email Address
                                </label>
                                <input
                                    className='appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                    id='loginemail'
                                    type='text'
                                    value={loginData.loginemail}
                                    onChange={handleLoginChange}
                                    />
                            </div>
                            <div className='mb-6'>
                                <label className='block text-white text-sm font-bold mb-2' htmlFor='loginpassword'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        className='appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                        id='loginpassword'
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginData.loginpassword}
                                        onChange={handleLoginChange}
                                        />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500'
                                        onClick={() => setShowPassword(!showPassword)}
                                        >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>
                            <div className='mb-6'>
                                <label className='inline-flex items-center'>
                                    <input
                                        type='checkbox'
                                        className='form-checkbox text-sky-500'
                                        />
                                    <span className='ml-2 text-white'>Remember Me</span>
                                </label>
                            </div>
                            <div className='flex items-center justify-between'>
                                <button
                                    className='group h-auto py-3 flex items-center hover:text-gray-500 justify-center w-full relative px-5 text-sm border-none rounded-sm text-white uppercase bg-gradient-to-b from-sky-500 to-[#00D0B8] overflow-hidden'
                                    type='button'
                                    onClick={handleLogin}
                                    disabled={loading}
                                    >
                                        <p className='z-50 w-max relative'>{loading ? 'Processing...' : 'Login'}</p>
                                        <div className='w-0 h-full top-0 left-0 absolute bg-white z-20 transition-all duration-300 group-hover:w-full'></div>
                                </button>
                            </div>
                                <Link to={"/my-account/lost-password/"} className='text-white w-full text-center cursor-pointer mt-2 underline'><p>Lost your password?</p></Link>
                        </form>
                    </div>
                    <div className='w-full md:w-1/2 p-8 rounded-r-lg '>
                        <h2 className='text-2xl font-bold mb-6'>Sign Up</h2>
                        <form>
                            <div className='flex gap-2 w-full mb-4'>
                                <div className='flex flex-col w-1/2 gap-2'>
                                    <label className='block text-white text-sm font-bold mb-2' htmlFor='firstName'>
                                        First Name *
                                    </label>
                                    <input
                                        className='appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                        id='firstName'
                                        type='text'
                                        value={signupData.firstName}
                                        onChange={handleSignupChange}
                                        />
                                </div>
                                <div className='flex flex-col w-1/2 gap-2'>
                                    <label className='block text-white text-sm font-bold mb-2' htmlFor='lastName'>
                                        Last Name *
                                    </label>
                                    <input
                                        className='appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                        id='lastName'
                                        type='text'
                                        value={signupData.lastName}
                                        onChange={handleSignupChange}
                                        />
                                </div>
                            </div>
                            <div className='mb-4'>
                                <label className='block text-white text-sm font-bold mb-2' htmlFor='username'>
                                    Username *
                                </label>
                                <input
                                    className='appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                    id='username'
                                    type='text'
                                    value={signupData.username}
                                    onChange={handleSignupChange}
                                    />
                            </div>
                            <div className='mb-4'>
                                <label className='block text-white text-sm font-bold mb-2' htmlFor='signupemail'>
                                    Email Address *
                                </label>
                                <input
                                    className='appearance-none bg-[#333] border-none rounded-md w-full py-3 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                    id='signupemail'
                                    type='email'
                                    value={signupData.signupemail}
                                    onChange={handleSignupChange}
                                    />
                            </div>
                            <div>
                                <p className='text-center text-white'>
                                    A link to set a new password will be sent to your email address.
                                </p>
                            </div>
                            <div className='flex items-center justify-center'>
                                <div className='mb-6'>
                                    <label className='inline-flex items-center'>
                                        <input
                                            type='checkbox'
                                            className='form-checkbox text-sky-500'
                                        />
                                        <span className='ml-2 text-white'>Yes, add me to your mailing list</span>
                                    </label>
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <button
                                    className='group h-auto py-3 flex items-center hover:text-gray-500 justify-center w-full relative px-5 text-sm border-none rounded-sm text-white uppercase bg-gradient-to-b from-sky-500 to-[#00D0B8] overflow-hidden'
                                    type='button'
                                    onClick={handleSignup}
                                    disabled={loading}
                                    >
                                   <p className='z-50 w-max relative'>{loading ? 'Processing...' : 'Register'}</p>
                                    <div className='w-0 h-full top-0 left-0 absolute bg-white z-20 transition-all duration-300 group-hover:w-full'></div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default LoginAndSignUp