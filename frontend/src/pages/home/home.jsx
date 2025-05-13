import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TripPlanningModal from '../../components/tripModal';
import greece from "../../assets/images/maldives.jpg"

export const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleCreateTrip = (tripData) => {
        // 1) Generate a temporary ID (we’ll replace this with Firestore later)
        const newTripId = Date.now().toString();

        // 2) TODO: here you’d call your Firestore addDoc() and get the real tripId
        // const realId = await addDoc(...)

        // 3) Navigate to the trip page, passing along the form data in location.state
        navigate(`/trip/${newTripId}`, { state: { trip: tripData } });
    };
    
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
            <button className="cta-button" onClick={openModal}>Start planning</button>

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

            <TripPlanningModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={(data) => {
                closeModal();
                handleCreateTrip(data);
                }}
            />
        </div>
    )

} 

export default Home;