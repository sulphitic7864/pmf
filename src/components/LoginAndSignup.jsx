import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { API_ENDPOINTS } from '../server/api_endpoints';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const initialLoginData = {loginemail: '', loginpassword: ''}
const initialSignupData = {signupemail: '', username: '', firstName: '', lastName: ''}
const inputClassName = 'w-full rounded-md border border-white/10 bg-[#242829] px-4 py-3 text-white placeholder:text-gray-500 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400'
const submitButtonClassName = 'w-full rounded-md bg-gradient-to-b from-sky-500 to-[#00D0B8] px-5 py-3 text-sm font-semibold uppercase text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-wait disabled:opacity-60'

const LoginAndSignUp = () => {
    const [authMode, setAuthMode] = useState('login');
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
                API_ENDPOINTS.UPDATE_USER_DETAILS(userId),
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
                setAuthMode('login');
            }
        } catch(error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className='min-h-screen w-full bg-black px-5 py-10 text-white sm:px-8'>
            <div className='mx-auto max-w-xl'>
                <p className='mb-3 text-sm font-semibold uppercase text-cyan-400'>Place My Films</p>
                <h1 className='text-3xl font-semibold sm:text-4xl'>
                    {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className='mt-2 text-sm text-gray-400'>
                    {authMode === 'login' ? 'Log in to continue to your account.' : 'Join Place My Films to share your work.'}
                </p>

                <section className='mt-8 rounded-xl border border-white/10 bg-[#101314] p-5 shadow-xl shadow-black/30 sm:p-8'>
                    {authMode === 'login' ? (
                        <>
                            <h2 className='mb-6 text-2xl font-semibold'>Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className='mb-5'>
                                    <label className='mb-2 block text-sm font-medium text-gray-200' htmlFor='loginemail'>
                                        Username or Email Address
                                    </label>
                                    <input
                                        className={inputClassName}
                                        id='loginemail'
                                        type='text'
                                        autoComplete='username'
                                        value={loginData.loginemail}
                                        onChange={handleLoginChange}
                                    />
                                </div>
                                <div className='mb-5'>
                                    <label className='mb-2 block text-sm font-medium text-gray-200' htmlFor='loginpassword'>
                                        Password
                                    </label>
                                    <div className='relative'>
                                        <input
                                            className={`${inputClassName} pr-12`}
                                            id='loginpassword'
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete='current-password'
                                            value={loginData.loginpassword}
                                            onChange={handleLoginChange}
                                        />
                                        <button
                                            type='button'
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 transition-colors hover:text-cyan-300'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>
                                <div className='mb-6 flex items-center justify-between gap-4 text-sm'>
                                    <label className='inline-flex items-center text-gray-300'>
                                        <input type='checkbox' className='form-checkbox text-sky-500' />
                                        <span className='ml-2'>Remember Me</span>
                                    </label>
                                    <Link to='/my-account/lost-password/' className='text-cyan-300 transition-colors hover:text-cyan-100'>
                                        Forgot password?
                                    </Link>
                                </div>
                                <button className={submitButtonClassName} type='submit' disabled={loading}>
                                    {loading ? 'Processing...' : 'Login'}
                                </button>
                            </form>
                            <p className='mt-6 text-center text-sm text-gray-400'>
                                New to Place My Films?{' '}
                                <button type='button' onClick={() => setAuthMode('register')} className='font-semibold text-cyan-300 transition-colors hover:text-cyan-100'>
                                    Create an account
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className='mb-6 text-2xl font-semibold'>Register</h2>
                            <form onSubmit={handleSignup}>
                                <div className='mb-4 flex flex-col gap-4 sm:flex-row'>
                                    <div className='w-full sm:w-1/2'>
                                        <label className='mb-2 block text-sm font-medium text-gray-200' htmlFor='firstName'>First Name *</label>
                                        <input className={inputClassName} id='firstName' type='text' autoComplete='given-name' value={signupData.firstName} onChange={handleSignupChange} />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <label className='mb-2 block text-sm font-medium text-gray-200' htmlFor='lastName'>Last Name *</label>
                                        <input className={inputClassName} id='lastName' type='text' autoComplete='family-name' value={signupData.lastName} onChange={handleSignupChange} />
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <label className='mb-2 block text-sm font-medium text-gray-200' htmlFor='username'>Username *</label>
                                    <input className={inputClassName} id='username' type='text' autoComplete='username' value={signupData.username} onChange={handleSignupChange} />
                                </div>
                                <div className='mb-4'>
                                    <label className='mb-2 block text-sm font-medium text-gray-200' htmlFor='signupemail'>Email Address *</label>
                                    <input className={inputClassName} id='signupemail' type='email' autoComplete='email' value={signupData.signupemail} onChange={handleSignupChange} />
                                </div>
                                <p className='mb-5 text-sm leading-6 text-gray-400'>A link to set a new password will be sent to your email address.</p>
                                <label className='mb-6 flex items-start text-sm text-gray-300'>
                                    <input type='checkbox' className='form-checkbox mt-1 text-sky-500' />
                                    <span className='ml-2'>Yes, add me to your mailing list</span>
                                </label>
                                <button className={submitButtonClassName} type='submit' disabled={loading}>
                                    {loading ? 'Processing...' : 'Register'}
                                </button>
                            </form>
                            <p className='mt-6 text-center text-sm text-gray-400'>
                                Already have an account?{' '}
                                <button type='button' onClick={() => setAuthMode('login')} className='font-semibold text-cyan-300 transition-colors hover:text-cyan-100'>
                                    Log in
                                </button>
                            </p>
                        </>
                    )}
                </section>
            </div>
        </main>
    )
}

export default LoginAndSignUp