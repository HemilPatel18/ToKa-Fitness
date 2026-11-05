import { useState } from 'react'
import { NavLink } from 'react-router'
import { CheckCircle } from '@boxicons/react'

import './Auth.css'
import InputBox from '../../components/InputBox/InputBox'
import axios from 'axios'

const backend_url = "http://127.0.0.1:8001"

const api = axios.create({
    baseURL: backend_url
});

export default function Auth() {
    const [selectedForm, setSelectedForm] = useState("login")

    function toggleForm() {
        if (selectedForm === "register") {
            setSelectedForm("login")
        } else {
            setSelectedForm("register")
        }
    }

    return (
        <>
            {/* {selectedForm == "register" ? <RegisterForm /> : <LoginForm />} */}
            {selectedForm === "register" ? (
                <RegisterForm toggleForm={toggleForm} />
            ) : (
                <LoginForm toggleForm={toggleForm} />
            )}
        </>
    )
}

function LoginForm({ toggleForm }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`${backend_url}/auth/login`, {
                email: email,
                password: password
            })

            console.log(response.data);
            alert("Account found successfully.")

            setEmail('');
            setPassword('');

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", response.data.email);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("initials", response.data.initials);
            window.location.replace("/");
        } catch (error) {
            console.error(
                'Error finding user:',
                error.response?.data || error.message
            );
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

                        <div className="inputs">
                            <InputBox text="Email address" placeholder="you@example.com" type="email" onChange={(e) => setEmail(e.target.value)} />
                            <InputBox text="Password" placeholder="Create a password" type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button type='submit' className='formCta'>Login &rarr;</button>

                        <div className="form-actions">
                            <p>Don't have an account?</p>
                            <button type="button" onClick={toggleForm} className="form-toggle-btn">Register</button>
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

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            console.error('Passwords do not match');
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
            // await addUser({ fullname, email, password, confirmPassword });
            const response = await axios.post(`${backend_url}/auth/register`, {
                name: fullname,
                initials: initials,
                email: email,
                password: password
            })

            console.log(response.data);
            alert("Account created successfully.")


            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(
                'Error adding user:',
                error.response?.data || error.message
            );
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
                        Your Fitness journey, your way
                    </div>
                </div>
                <div className="right">
                    <form onSubmit={handleSubmit}>
                        <span className='welcome-text'>Welcome to ToKa Fitness.</span>
                        <h2>Create account</h2>
                        <p>Start your fitness and healthy-living journey. It's free to join, and everyone is welcome</p>

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
                            <button type="button" onClick={toggleForm} className="form-toggle-btn">Login</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}