import { NavLink } from 'react-router'
import './MembershipCard.css'

export default function MembershipCard({ title, description, price, tier, list, best_for, button_text }) {
    return (
        <>
            <div className="card">
                <h1>{title}</h1>
                <p>{description}</p>
                <div className="row">
                    <span>£{price} / month</span>
                    <span className='tier'>{tier}</span>
                </div>
                <div className="list">
                    <ul className="list">
                        {list?.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className="bottom">
                    <p>{best_for}</p>
                    <NavLink>{button_text}</NavLink>
                </div>
            </div>
        </>
    )
}