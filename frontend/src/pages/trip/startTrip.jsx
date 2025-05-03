import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Menu, Plus, Users, Heart, Circle, CalendarIcon, CircleDollarSign, CalendarDaysIcon, CalendarCheck, CalendarRange, LucideCalendar, SunIcon, Car, Hotel, Plane, Utensils} from 'lucide-react';

export const TripStart = () => {
    //testing
    const [trips, setTrips] = useState([
        { id: '1', title: 'Greek Islands Adventure', dateRange: 'Jun 12 – Jun 25, 2025', location: 'Athens, Santorini, Mykonos'},
        { id: '2', title: 'Bali Getaway', dateRange: 'Aug 5 – Aug 15, 2025', location: 'Denpasar, Ubud, Seminyak'}
      ]);
    const [activeTrip, setActiveTrip] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("Overview");
    const [activeReservation, setActiveReservation] = useState("Flights");

    const [favorite, setFavorite] = useState(false);

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

            <div className="trip-content" /*style={{ marginLeft: sidebarOpen ? "250px" : "0", width: sidebarOpen ? "calc(100% - 250px)" : "100%" }}*/ >
                <div className="trip-navbar">
                    {!sidebarOpen && (
                        <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
                        <Menu size={20}/>
                        </button>
                    )}
                    <div className="trip-info">
                        <h3 className="trip-navtitle">{trips[activeTrip].title}</h3>
                        <h5 className="trip-navdate">{trips[activeTrip].dateRange} &#8226; {trips[activeTrip].location}</h5>
                    </div>
                    
                    <div className="trip-extras">
                        <button onClick={() => setFavorite((prev => !prev))} className="trip-fav">
                            <Heart size={20} fill={favorite ? 'red' : 'none'} color={favorite ? 'red' : 'black'} />
                        </button>

                        <div className="trip-collaborators">
                            <Circle/>
                        </div>

                        <button className="trip-share-btn">
                            <h5>Share</h5>
                        </button>
                    </div>
                </div>

                <div className="trip-main-page">
                    <div className="trip-pic">
                        <h1>pic here</h1>
                    </div>

                    <div className="trip-overview">
                        <div className="trip-duration">
                            <div className="trip-duration-icon">
                                <CalendarIcon/>
                            </div>
                            <div className="trip-duration-details">
                                <h4>Duration</h4>
                                <h5>14 days</h5>
                            </div>
                        </div>

                        <div className="trip-weather">
                            <div className="trip-weather-icon">
                                <SunIcon/>
                            </div>
                            <div className="trip-weather-details">
                                <h4>Weather</h4>
                                <h5>74 F</h5>
                            </div>
                        </div>

                        <div className="trip-size">
                            <div className="trip-size-icon">
                                <Users/>
                            </div>
                            <div className="trip-size-details">
                                <h4>Group Size</h4>
                                <h5>3 travelers</h5>
                            </div>
                        </div>

                        <div className="trip-budget">
                            <div className="trip-budget-icon">
                                <CircleDollarSign/>
                            </div>
                            <div className="trip-budget-details">
                                <h4>Budget</h4>
                                <h5>$2,500</h5>
                            </div>
                        </div>
                    </div>


                    <div className="trip-map">
                        <h3>map</h3>
                    </div>

                    <div className="trip-reservations">
                        <h3 className="reservation-text">Reservations</h3>
                        <div className="reservation-types">
                            <div className={`reservation-flight ${activeReservation === "Flights" ? "active" : ""}`} onClick={() => setActiveReservation("Flights")}>
                                <Plane className="plane-icon" size={17.5}/>
                                <h4 className="flight-text">Flights</h4>
                                
                            </div>
                            <div className={`reservation-lodging ${activeReservation === "Lodging" ? "active" : ""}`} onClick={() => setActiveReservation("Lodging")}>
                                <Hotel className="hotel-icon" size={17.5}/>
                                <h4 className="lodging-text">Lodging</h4>
                            </div>
                            <div className={`reservation-transportation ${activeReservation === "Transportation" ? "active" : ""}`} onClick={() => setActiveReservation("Transportation")}>
                                <Car className="car-icon" size={17.5}/>
                                <h4 className="transportation-text">Transportation</h4>
                            </div>
                            <div className={`reservation-dining ${activeReservation === "Dining" ? "active" : ""}`} onClick={() => setActiveReservation("Dining")}>
                                <Utensils className="dining-icon" size={17.5}/>
                                <h4 className="dining-text">Dining</h4>
                            </div>
                        </div>

                        <div className="reservation-details">
                            <h3>stuff here</h3>
                        </div>
                    </div>

                    <div className="trip-itinerary">
                        <h3>stuff</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TripStart;