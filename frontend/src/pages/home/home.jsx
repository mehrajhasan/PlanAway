import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import TripPlanningModal from '../../components/tripModal';
import greece from "../../assets/images/maldives.jpg"

export const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleCreateTrip = (tripData) => {
        const newTripId = uuidv4();

        // 1) Get existing trips
        const existingTrips = JSON.parse(localStorage.getItem('trips')) || [];

        // 2) Add new trip with its ID
        const tripWithId = { id: newTripId, ...tripData };
        const updatedTrips = [...existingTrips, tripWithId];

        // 3) Save to localStorage
        localStorage.setItem('trips', JSON.stringify(updatedTrips));

        // 4) Navigate without passing trip in state
        navigate(`/trip/${newTripId}`);
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