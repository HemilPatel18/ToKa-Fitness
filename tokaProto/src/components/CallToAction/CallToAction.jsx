import { NavLink } from 'react-router'

import './CallToAction.css'

export default function CallToAction({link, text, bg, onClick}) {
    return(
        <>
            <NavLink to={link} className="cta" style={{ '--bg': bg }} onClick={onClick}>
                {text}
            </NavLink>
        </>
    )
}