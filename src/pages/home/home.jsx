import React from 'react';
import greece from "../../assets/images/greece.jpeg"

export const Home = () => {

    return (
        <div className="homepage">
            <header className="header">
                <h2 className="logo">PlanAway</h2>
                <div className="auth">
                    <button className="login-btn">Login</button>
                    <button className="signup-btn">Sign up</button>
                </div>
            </header>

            <section className="hero">
                <img src={greece} alt="greece" className="hero-image"/>
            </section>
            <button className="cta-button">Start planning</button>

        </div>
    )

} 

export default Home;