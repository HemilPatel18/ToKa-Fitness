import './Home.css'
import CallToAction from '../../components/CallToAction/CallToAction'
import MembershipCard from '../../components/MembershipCard/MembershipCard'

export default function Home() {
    return (
        <>
            <div className="hero-banner">
                <div className="box">
                    <h1>Your Fitness Journey, Your Way</h1>
                    <p>Get expert training and healthy-living advice whenever you need it, build a workout and eating plan around your own goals, and access free and premium content to keep you progressing. Join a community of members who'll keep you motivated every step of the way.</p>
                    <div className="row">
                        <p>Join and start your fitness journey today.</p>
                        <CallToAction link="#memberships-section" className="cta" text="Get Started"/>
                    </div>
                </div>
                <h1>Image Banner</h1>
            </div>

            <div className="info-banner">
                <div className="info-box">
                    <h2>Why choose ToKa Fitness: </h2>
                    <p>Personalized progress tracking helps you set realistic goals, celebrate small wins, and stay motivated with a plan that fits your schedule and abilities.</p>
                    <p>Easy-to-follow guidance gives you clear workout and healthy-living advice, so you can build routines that feel manageable, sustainable, and supportive.</p>
                    <p>A welcoming community supports young people, older adults, and people with disabilities, helping everyone feel included, encouraged, and accountable every step of the way.</p>
                </div>
                <div className="image">
                    Image
                </div>
            </div>

            <div className="memberships-section" id='memberships-section'>
                <h1>Choose a membership that fits your fitness and healthy-living goals:</h1>
                <p>Explore free and premium digital resources, customisable plans, community support, and personal-training guidance designed to be welcoming and accessible.</p>
                <div className="memberships">
                    <MembershipCard title="Free" description="Start with free digital resources, community support, and accessible tools to help you begin your fitness and healthy-living journey." price="0" tier="Free" list={
                        ["Free fitness and healthy-living advice",
                         "Community support and member stories",
                         "Accessible digital tools and guidance"
                        ]} best_for="Best for: people exploring healthy habits and looking for a supportive place to begin." button_text="Start free"/>
                    <MembershipCard title="Plus" description="Upgrade to premium digital guidance, customisable plans, and structured support to help you build consistent routines." price="19" tier="Plus" list={
                        ["Premium fitness and healthy-living guidance",
                         "Customisable workout and eating plans",
                         "Social features to stay connected and motivated"
                        ]} best_for="Best for: people who want more guidance, structure, and premium support as they build momentum." button_text="Choose Plus"/>
                    <MembershipCard title="Personal Coaching" description="Add tailored support from ToKa Fitness trainers for people who want accountability and expert guidance tailored to their needs." price="79" tier="Coaching" list={
                        ["Tailored coaching and accountability",
                         "Progress reviews and personalized adjustments",
                         "Priority support for long-term progress"
                        ]} best_for="Best for: people who want expert guidance, accountability, and a more personalized fitness journey." button_text="Explore Coaching"/>
                </div>
            </div>
        </>
    )
}