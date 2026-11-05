import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import './Header.css'

import CallToAction from '../CallToAction/CallToAction'

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === 'true'
    );

    function handleSignOut(e) {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
    }

    return (
        <>
            <div className="main-header">
                <NavLink to="/" className="logo">ToKa Fitness</NavLink>
                {/* <div className="nav-links"> */}
                {localStorage.getItem("isLoggedIn") ?
                    <div className="nav-links">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/memberships">Memberships</NavLink>
                        <NavLink to="/chat">Chat</NavLink>
                    </div>
                :
                    <div className="nav-links">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/memberships">Memberships</NavLink>
                    </div>
                }

                {/* <NavLink to="/">Home</NavLink>
                <NavLink to="/memberships">Memberships</NavLink>
                <NavLink to="/chat">Chat</NavLink> */}

                {/* </div> */}

                {/* <div className="pfp-box">
                    <div className="pfp">
                        <span>{localStorage.getItem("initials")}</span>
                    </div>
                    <div className="pfp-menu">
                        <CallToAction className="cta" link="#" text="Sign Out" bg="#808080" onClick={handleSignOut}/>        
                    </div>
                </div> */}

                {localStorage.getItem("isLoggedIn") ? 
                <div className="pfp-box">
                    <div className="pfp">
                        <span>{localStorage.getItem("initials")}</span>
                    </div>
                    <div className="pfp-menu">
                        <CallToAction className="cta" link="#" text="Sign Out" bg="#808080" onClick={handleSignOut}/>        
                        <CallToAction className="cta" link="#" text="Settings" bg="#808080"/>        
                    </div>
                </div>
                :
                <CallToAction className="cta" link="/auth" text="Sign In" bg="#808080"/> }
            </div>
        </>
    )
}