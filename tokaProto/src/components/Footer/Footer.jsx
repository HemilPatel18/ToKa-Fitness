import { Link, NavLink } from 'react-router'

import './Footer.css'
import { Twitter, Facebook, Youtube, Tiktok, Copyright } from '@boxicons/react'

export default function Footer() {
    return (
        <>
            <div className="footer">
                <div className="top">
                    <div className="socials">
                        <span>Follow Us</span>
                        <div className="icons">
                            <NavLink><Twitter /></NavLink>
                            <NavLink><Facebook /></NavLink>
                            <NavLink><Youtube /></NavLink>
                            <NavLink><Tiktok /></NavLink>
                        </div>
                    </div>
                    <div className="contact">
                        <span>Contact Us</span>
                        <form >
                            <div className="inputs">
                                <span>Email:</span>
                                <input type="email" id="email-input" placeholder='Email...' required/>
                                <span>Enquiry (Optional):</span>
                                <input type="text" id="enquiry-input" placeholder=''/>
                            </div>
                            <button type="button">Send</button>
                        </form>
                    </div>
                    <div className="info">
                        <div className="address">
                            <span>Office: </span>
                            <span>14 Chestnut Grove</span>
                            <span>Meadowfield</span>
                            <span>North Yorkshire</span>
                            <span>HG4 2BL</span>
                            <span>United Kingdom</span>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="copyright">
                        <Copyright />
                        <span>2026 ToKa Fitness</span>
                    </div>
                </div>
            </div>
        </>
    )
}