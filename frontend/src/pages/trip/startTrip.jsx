import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate,  useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, Menu, Plus, Users, Heart, Circle, CalendarIcon, DollarSign, CalendarDaysIcon, CalendarCheck, CalendarRange, LucideCalendar, SunIcon, Car, Hotel, Plane, Utensils} from 'lucide-react';

export const TripStart = () => {
    const { tripId } = useParams();
    const [trips, setTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const destination = trips[activeTrip]?.destination;
            if (!destination) return;

            try {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(destination)}&per_page=1`,
                {
                    headers: {
                        Authorization: "T2zBsuqtXcFOTg0t0X4pXlbXv46Bd0LFRLpyV372s6OBAYFkoth9Ho5K"
                    }
                }
            );

            const data = await response.json();
            const photoUrl = data.photos?.[0]?.src?.landscape;

            if (photoUrl) {
                setImageUrl(photoUrl);
            } else {
                setImageUrl(null);
            }
            } catch (err) {
            console.error("Failed to fetch Pexels image", err);
            }
        };

        fetchImage();
    }, [activeTrip, trips]);


    useEffect(() => {
        const allTrips = JSON.parse(localStorage.getItem("trips")) || [];

        const formattedTrips = allTrips.map(t => ({
            ...t,
            dateRange: `${t.startDate.slice(0, 10)} – ${t.endDate.slice(0, 10)}`
        }));

        setTrips(formattedTrips);

        const foundIndex = formattedTrips.findIndex(t => t.id === tripId);
        if (foundIndex !== -1) setActiveTrip(foundIndex);
    }, [tripId]);



    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("Overview");
    const [activeReservation, setActiveReservation] = useState("Flights");
    const [favorite, setFavorite] = useState(false);

    if (trips.length === 0) {
    return <div className="loading-screen"><h2>Loading trip...</h2></div>;
    }
    

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
                            <div className="trip-list-scroll">
                                <div className="trip-list">
                                {trips.map((trip, index) => (
                                    <div
                                        key={trip.id}
                                        className={`trip-item ${activeTrip === index ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveTrip(index);
                                            navigate(`/trip/${trips[index].id}`);
                                        }}
                                    >
                                        <h4 className="trip-title">{trip.name}</h4>
                                        <h5 className="trip-date">{trip.dateRange}</h5>
                                    </div>
                                    ))}
                                </div>
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
                        <h3 className="trip-navtitle">{trips[activeTrip].name}</h3>
                        <h5 className="trip-navdate">{trips[activeTrip].dateRange} &#8226; {trips[activeTrip].destination}</h5>
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
                        {imageUrl ? (
                            <img src={imageUrl} alt="Destination" className="trip-cover-img" />
                        ) : (
                            <div className="fallback-pic">No image found</div>
                        )}
                    </div>

                    <div className="trip-overview">
                        <div className="trip-duration">
                            <div className="trip-duration-icon">
                                <CalendarIcon color="#4285f4"/>
                            </div>
                            <div className="trip-duration-details">
                                <h4>Duration</h4>
                                <h5>{
                                        Math.ceil(
                                        (new Date(trips[activeTrip].endDate) - new Date(trips[activeTrip].startDate)) / (1000 * 60 * 60 * 24)
                                        )
                                    } days
                                </h5>
                            </div>
                        </div>

                        <div className="trip-weather">
                            <div className="trip-weather-icon">
                                <SunIcon color="#fbbc05"/>
                            </div>
                            <div className="trip-weather-details">
                                <h4>Weather</h4>
                                <h5>74 F</h5>
                            </div>
                        </div>

                        <div className="trip-size">
                            <div className="trip-size-icon">
                                <Users color="#34a853"/>
                            </div>
                            <div className="trip-size-details">
                                <h4>Group Size</h4>
                                <h5>{trips[activeTrip].travelers} travelers</h5>
                            </div>
                        </div>

                        <div className="trip-budget">
                            <div className="trip-budget-icon">
                                <DollarSign color="#a142f4"/>
                            </div>
                            <div className="trip-budget-details">
                                <h4>Budget</h4>
                                <h5>${trips[activeTrip].budget}</h5>
                            </div>
                        </div>
                    </div>


                    <div className="trip-map">
                        <iframe
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '12px' }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyCvbPp-StCEnPiaUfFeqoRU2fqdQW2WWC4&center=${trips[activeTrip].lat},${trips[activeTrip].lng}&zoom=12`}
                        />
                    </div>

                    <div className="trip-reservations">
                        <div className="reservation-header">
                            <h3 className="reservation-text">Reservations</h3>
                            <button className="add-btn">
                                <h5>Add new</h5>
                            </button>
                        </div>
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
                        <h3>Itinerary</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TripStart;