import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Compass, Plus, Users } from 'lucide-react';

export const TripStart = () => {
    //testing
    const [trips, setTrips] = useState([
        { id: '1', title: 'Greek Islands Adventure', dateRange: 'Jun 12 – Jun 25, 2025' },
        { id: '2', title: 'Bali Getaway', dateRange: 'Aug 5 – Aug 15, 2025' }
      ]);
    const [activeTrip, setActiveTrip] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("Overview");

      //figure out later
    // useEffect(() => {
    //     const existing = localStorage.getItem('guestId');
    //     if(!existing){
    //         localStorage.setItem('guestId', uuidv4());
    //     }
    // }, []);

    // const handleSave = async () => {
    //     const user = auth.currentUser;
    //     const guestId = localStorage.getItem('guestId');
        
    // }

    return (
        <div className="tripView">
            {sidebarOpen && (
                <aside className="tripSidebar">
                    <div className="sidebar-header">
                        <div className="logo-row">
                            <h3>PlanAway</h3>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="close-btn">
                            <ChevronLeft className="left-icon"/>
                        </button>
                    </div>

                    <div className="sidebar-content">
                        <button className="new-trip-btn">
                            <Plus className="plus-icon"/>
                            <span>New Trip</span>
                        </button>

                        <div className="trips-section">
                            <h4 className="trip-header">YOUR TRIPS</h4>
                            <div className="trip-list">
                            {trips.map((trip, index) => (
                                <div
                                    key={trip.id}
                                    className={`trip-item ${activeTrip === index ? 'active' : ''}`}
                                    onClick={() => setActiveTrip(index)}
                                >
                                    <h4 className="trip-title">{trip.title}</h4>
                                    <h5 className="trip-date">{trip.dateRange}</h5>
                                </div>
                                ))}
                            </div>
                        </div>

                        <div className="trip-details">
                            <h4 className="trip-header">TRIP DETAILS</h4>
                            <div className="trip-nav">
                            {["Overview","Itinerary","Places to Visit","Budget","Notes"].map((section) => (
                                <div
                                    key={section.id}
                                    className={`trip-nav-btn ${activeSection === section ? 'active' : ''}`}
                                    onClick={() => setActiveSection(section)}
                                >
                                <span>{section}</span>
                                </div>
                                ))}
                            </div>
                        </div>

                        <div className="collaborators">
                            <Users className="collab-icon" size={20}/>
                            <h4 className="collab-text">Invite Collaborators</h4>
                        </div>
                    </div>
                </aside>
            )}

            <div className="trip-navbar">
                <div className="trip-info">
                    
                </div>

                <div className="trip-search">

                </div>

                <div className="trip-fav">

                </div>

                <div className="trip-collaborators">

                </div>

                <div className="trip-share-btn">

                </div>
            </div>
        </div>
    )
}

export default TripStart;