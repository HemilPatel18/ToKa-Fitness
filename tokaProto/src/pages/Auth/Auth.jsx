import { useState } from 'react'
import { NavLink } from 'react-router'
import { CheckCircle } from '@boxicons/react'

import './Auth.css'
import InputBox from '../../components/InputBox/InputBox'
import api from '../../api'

export default function Auth() {
    const [selectedForm, setSelectedForm] = useState("login")

    function toggleForm() {
        setSelectedForm((form) => form === "register" ? "login" : "register")
    }

    return (
        selectedForm === "register" ? (
            <RegisterForm toggleForm={toggleForm} />
        ) : (
            <LoginForm toggleForm={toggleForm} />
        )
    )
}

function LoginForm({ toggleForm }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password
            })

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", response.data.email);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("initials", response.data.initials);
            window.location.replace('/');
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || 'Unable to sign in. Please try again.');
        }
    }


    return (
        <>
            <main className='auth-page'>
                <div className="left">
                    <div className="top-info">
                        Your Fitness journey, your way
                    </div>
                    <div className="bottom-info">
                        <div className="title">
                            <h1>Your next chapter starts here.</h1>
                            <p>Build healthy habits with expert guidance, flexible plans, and a community that supports you every step of the way.</p>
                        </div>
                        <div className="line"></div>
                        <div className="list">
                            <li><CheckCircle />Free resources to help you begin</li>
                            <li><CheckCircle />Workout and eating plans that fit you</li>
                            <li><CheckCircle />Support for every age and ability</li>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <form onSubmit={handleSubmit}>
                        <span className='welcome-text'>Welcome to ToKa Fitness.</span>
                        <h2>Login</h2>
                        <p>Continue your fitness and healthy-living journey.</p>

                        {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

                        <div className="inputs">
                            <InputBox text="Email address" placeholder="you@example.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                            <InputBox text="Password" placeholder="Create a password" type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button type='submit' className='formCta'>Login &rarr;</button>

                        <div className="form-actions">
                            <p>Don't have an account?</p>
                            <button type="button" onClick={toggleForm} className="form-toggle-btn">Sign up</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

function RegisterForm({ toggleForm }) {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        const initials = fullname
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()

        try {
            const response = await api.post('/auth/register', {
                name: fullname,
                initials: initials,
                email: email,
                password: password
            })

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", response.data.email);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("initials", response.data.initials);
            window.location.replace('/');
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || 'Unable to create your account. Please try again.');
        }
    }

    return (
        <>
            <main className='auth-page'>
                <div className="left">
                    <div className="top-info">
                        Your Fitness journey, your way
                    </div>
                    <div className="bottom-info">
                        <div className="title">
                            <h1>Find your community.</h1>
                            <p>Join ToKa Fitness for practical guidance and support that meets you where you are.</p>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <form onSubmit={handleSubmit}>
                        <span className='welcome-text'>Welcome to ToKa Fitness.</span>
                        <h2>Create account</h2>
                        <p>Start your fitness and healthy-living journey. It's free to join, and everyone is welcome</p>

                        {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

                        <div className="inputs">
                            <InputBox text="Full Name" placeholder="Enter your full name" type="text" onChange={(e) => setFullName(e.target.value)} />
                            <InputBox text="Email address" placeholder="you@example.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                            <InputBox text="Password" placeholder="Create a password" type="password" onChange={(e) => setPassword(e.target.value)} />
                            <InputBox text="Confirm password" placeholder="Re-enter your password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div className="agreement">
                            <input type="checkbox" id="" required/>
                            <span>I agree to the <NavLink to="/">Terms of use</NavLink> and <NavLink to="/">Privacy policy.</NavLink></span>
                        </div>

                        <button type='submit' className='formCta'>Create account &rarr;</button>

                        <div className="form-actions">
                            <p>Already have an account?</p>
                            <button type="button" onClick={toggleForm} className="form-toggle-btn">Sign in</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}