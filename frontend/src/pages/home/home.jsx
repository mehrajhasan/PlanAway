import React from 'react';
import { useNavigate } from 'react-router-dom';
import greece from "../../assets/images/maldives.jpg"

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <header className="header">
                <h2 className="logo">PlanAway</h2>
                <div className="auth">
                    <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                    <button className="signup-btn" onClick={() => navigate('/register')}>Sign up</button>
                </div>
            </header>

            <section className="hero">
                <img src={greece} alt="greece" className="hero-image"/>
            </section>
            <button className="cta-button">Start planning</button>

            <h2 className="featureName">Your All-in-One Trip Planner</h2>
            <section className="features">
                <div className="box">
                    <h3>box</h3>
                </div>
                <div className="box">
                    <h3>box</h3>
                </div>
                <div className="box">
                    <h3>box</h3>
                </div>
                <div className="box">
                    <h3>box</h3>
                </div>
                <div className="box">
                    <h3>box</h3>
                </div>
                <div className="box">
                    <h3>box</h3>
                </div>
            </section>
        </div>
    )

} 

export default Home;