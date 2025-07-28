import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import TripPlanningModal from '../../components/tripModal';
import greece from "../../assets/images/maldives.jpg"
import requireAuth from '../../hooks/requireAuth';
import LoginModal from '../../components/loginModal';
import RegisterModal from '../../components/registerModal';
import Features from '../../components/features';
import Testimonials from '../../components/testomonials';
import Footer from '../../components/footer';
import {
  MapIcon,
  PlaneIcon,
  LandmarkIcon,
  CreditCardIcon,
  UsersIcon,
  FileTextIcon,
} from "lucide-react";

export const Home = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login'); 
    const [pendingTrip, setPendingTrip] = useState(null);
    
    const handleLoginSuccess = () => {
        setShowAuthModal(false);

        const skippedTripId = localStorage.getItem('skippedTripId');
        if (skippedTripId) {
            const trips = JSON.parse(localStorage.getItem('trips')) || [];
            const skippedTrip = trips.find((trip) => trip.id === skippedTripId);

            if (skippedTrip) {
                handleCreateTrip(skippedTrip);
            }

            localStorage.removeItem('skippedTripId');
            setPendingTrip(null);
        } else if (pendingTrip) {
            handleCreateTrip(pendingTrip);
            setPendingTrip(null);
        }
    };


    const handleSkip = () => {
        if (!pendingTrip) return;
        const id = uuidv4();
        const tripWithId = { id, ...pendingTrip };
        const existing = JSON.parse(localStorage.getItem('trips')) || [];
        localStorage.setItem('trips', JSON.stringify([...existing, tripWithId]));
        localStorage.setItem('skippedTripId', id);
        setShowAuthModal(false);
        setPendingTrip(null);
        navigate(`/trip/${id}`);
    };

    const handleCreateTrip = async (tripData) => {
        const newTripId = uuidv4();
        const tripWithId = { id: newTripId, ...tripData, ownerId: auth.currentUser.uid };

        try {
            const user = await requireAuth();

            if (user) {
                await setDoc(doc(db, 'trips', newTripId), tripWithId);
                await updateDoc(doc(db, 'users', user.uid), {trips: arrayUnion(newTripId),});
                navigate(`/trip/${newTripId}`);
            } else {
                throw new Error('User cancelled login');
            }
        } catch (err) {
            setPendingTrip(tripData);
            setShowAuthModal(true);
            return;
        }
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

            {/* <h2 className="featureName">Your All-in-One Trip Planner</h2>
            <section className="feature-grid">
                {[
                    {
                    icon: <MapIcon className="icon" />,
                    title: "Itinerary Builder",
                    desc: "Build your daily schedule with drag & drop ease.",
                    },
                    {
                    icon: <PlaneIcon className="icon" />,
                    title: "Reservations",
                    desc: "Flights, hotels, restaurants — organized & editable.",
                    },
                    {
                    icon: <LandmarkIcon className="icon" />,
                    title: "Places to Go",
                    desc: "Smart suggestions tailored to your trip's season & city.",
                    },
                    {
                    icon: <CreditCardIcon className="icon" />,
                    title: "Expense Splitting",
                    desc: "Track spending, tag friends, and balance costs together.",
                    },
                    {
                    icon: <UsersIcon className="icon" />,
                    title: "Live Collaboration",
                    desc: "Plan together in real-time — synced edits, shared comments.",
                    },
                    {
                    icon: <FileTextIcon className="icon" />,
                    title: "Notes & Docs",
                    desc: "Packing lists, checklists, and trip docs, all in one place.",
                    },
                ].map((f, idx) => (
                    <div className="feature-card" key={idx}>
                    <div className="icon-wrap">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                    </div>
                ))}
            </section> */}
            <Features/>
            <Testimonials/>
            <Footer/>

            <TripPlanningModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={(data) => {
                    closeModal();
                    handleCreateTrip(data);
                }}
            />

            {showAuthModal && (
                authMode === 'login' ? (
                    <LoginModal
                        pendingTrip={pendingTrip}
                        onSuccess={handleLoginSuccess}
                        onClose={() => setShowAuthModal(false)}
                        switchToSignup={() => setAuthMode('signup')}
                        onSkip={handleSkip}
                    />
                ) : (
                    <RegisterModal
                        pendingTrip={pendingTrip}
                        onSuccess={handleLoginSuccess}
                        onClose={() => setShowAuthModal(false)}
                        switchToLogin={() => setAuthMode('login')}
                        onSkip={handleSkip}
                    />
                )
            )}
        </div>
    )

} 

export default Home;