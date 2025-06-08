import React, { act, useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate,  useLocation, useParams } from 'react-router-dom';
import ReservationModal from '../../components/resModal';
import ItineraryModal from '../../components/itineraryModal';
import EditItineraryModal from '../../components/editItineraryModal';
import EllipseDropdown from '../../components/ellipseDropdown';
import { ChevronLeft, Menu, Plus, Users, Heart, Circle, CalendarIcon, DollarSign, SunIcon, Car, Hotel, Plane, Utensils, Ellipsis, ShoppingBag, Ticket, ReceiptText, TrendingUp} from 'lucide-react';
import TripPlanningModal from '../../components/tripModal';
import ExpenseModal from '../../components/expenseModal';
import EditExpenseModal from '../../components/editExpenseModal';
import EditReservationModal from '../../components/editResModal';

export const TripStart = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    const GCP_APIKEY1 = import.meta.env.VITE_GCP_APIKEY1;
    const GCP_APIKEY2 = import.meta.env.VITE_GCP_APIKEY2;
    const PEXELS_APIKEY = import.meta.env.VITE_PEXELS_APIKEY;

    useEffect(() => {
        const fetchImage = async () => {
            const destination = trips[activeTrip]?.destination;
            if (!destination) return;

            try {
            const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(destination)}&per_page=1`,
                {
                    headers: {
                        Authorization: PEXELS_APIKEY,
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
            dateRange: `${new Date(t.startDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })} – ${new Date(t.endDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })}`
        }));

        setTrips(formattedTrips);

        const foundIndex = formattedTrips.findIndex(t => t.id === tripId);
        if (foundIndex !== -1) setActiveTrip(foundIndex);
    }, [tripId]);



    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("Overview");
    const [activeReservation, setActiveReservation] = useState("Flights");
    const [favorite, setFavorite] = useState(false);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [reservations, setReservations] = useState({
        Flights: [],
        Lodging: [],
        Transportation: [],
        Dining: []
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showNewTrip, setNewTrip] = useState(false);
    const openTripModal = () => setNewTrip(true);
    const closeTripModal = () => setNewTrip(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editReservation, setEditReservation] = useState(null);


    useEffect(() => {
        if (tripId) {
            const savedReservations = localStorage.getItem(`reservations_${tripId}`);
            if (savedReservations) {
                try {
                    const parsedReservations = JSON.parse(savedReservations);
                    setReservations(parsedReservations);
                } catch (error) {
                    console.error('Error parsing saved reservations:', error);
                    setReservations({
                        Flights: [],
                        Lodging: [],
                        Transportation: [],
                        Dining: []
                    });
                }
            } else {
                setReservations({
                    Flights: [],
                    Lodging: [],
                    Transportation: [],
                    Dining: []
                });
            }
        }
    }, [tripId]);

    useEffect(() => {
        if (trips.length > 0 && trips[activeTrip]) {
            const currentTripId = trips[activeTrip].id;
            const savedReservations = localStorage.getItem(`reservations_${currentTripId}`);
            if (savedReservations) {
                try {
                    const parsedReservations = JSON.parse(savedReservations);
                    setReservations(parsedReservations);
                } catch (error) {
                    console.error('Error parsing saved reservations:', error);
                    setReservations({
                        Flights: [],
                        Lodging: [],
                        Transportation: [],
                        Dining: []
                    });
                }
            } else {
                setReservations({
                    Flights: [],
                    Lodging: [],
                    Transportation: [],
                    Dining: []
                });
            }
        }
    }, [activeTrip, trips]);

    const handleCreateTrip = (tripData) => {
        const newTripId = uuidv4();

        const existingTrips = JSON.parse(localStorage.getItem('trips')) || [];

        const tripWithId = { id: newTripId, ...tripData };
        const updatedTrips = [...existingTrips, tripWithId];

        localStorage.setItem('trips', JSON.stringify(updatedTrips));

        navigate(`/trip/${newTripId}`);
    };

    const saveReservationsToStorage = (newReservations) => {
        const currentTripId = trips[activeTrip]?.id || tripId;
        if (currentTripId) {
            try {
                localStorage.setItem(`reservations_${currentTripId}`, JSON.stringify(newReservations));
            } catch (error) {
                console.error('Error saving reservations to localStorage:', error);
            }
        }
    };

    const handleSaveReservation = (reservation) => {
        const reservationWithId = {
            ...reservation,
            id: uuidv4()
        };

        const newReservations = {
            ...reservations,
            [reservation.type]: [...reservations[reservation.type], reservationWithId]
        };
        
        setReservations(newReservations);
        saveReservationsToStorage(newReservations);
    };

    const handleEditReservation = (updatedReservation) => {
        const category = updatedReservation.type;

        if (!updatedReservation.id) {
            console.log('broken')
            return;
        }

        const updatedCategory = (reservations[category] || []).map((res) =>
            res.id === updatedReservation.id ? updatedReservation : res
        );

        const newReservations = {
            ...reservations,
            [category]: updatedCategory,
        };

        setReservations(newReservations);
        saveReservationsToStorage(newReservations);
        setEditReservation(null); // close modal
    };



    const handleAddActivity = (date, activity) => {
        const dateKey = new Date(date).toISOString().split("T")[0];
        const updatedTrip = { ...trips[activeTrip] };
        const dayItems = updatedTrip.itinerary?.[dateKey] || [];

        const activityWithId = {
            ...activity,
            id: uuidv4()
        };

        updatedTrip.itinerary = {
            ...updatedTrip.itinerary,
            [dateKey]: [...dayItems, activityWithId].sort((a, b) => a.time.localeCompare(b.time))
        };

        const tripsCopy = [...trips];
        tripsCopy[activeTrip] = updatedTrip;
        setTrips(tripsCopy);
        localStorage.setItem("trips", JSON.stringify(tripsCopy));
    };

    const handleUpdateActivity = (updatedActivity) => {
        const updatedTrip = { ...trips[activeTrip] };
        const dayItems = updatedTrip.itinerary?.[editingActivity.dateKey] || [];

        const updatedDayItems = dayItems.map((act) =>
            act.id === updatedActivity.id ? updatedActivity : act
        );

        updatedTrip.itinerary[editingActivity.dateKey] = updatedDayItems;

        const tripsCopy = [...trips];
        tripsCopy[activeTrip] = updatedTrip;
        setTrips(tripsCopy);
        localStorage.setItem("trips", JSON.stringify(tripsCopy));
        setEditingActivity(null); // close modal
    };


    const handleDeleteActivity = (dateKey, activityId) => {
        const trip = { ...trips[activeTrip] };
        const updatedItems = trip.itinerary[dateKey].filter((act) => act.id !== activityId);

        trip.itinerary[dateKey] = updatedItems;

        const tripsCopy = [...trips];
        tripsCopy[activeTrip] = trip;
        setTrips(tripsCopy);
        localStorage.setItem("trips", JSON.stringify(tripsCopy));
    };

    const handleSaveExpense = (data) => {
        const newExpense = {
            id: uuidv4(),
            title: data.title,
            activity: data.activity,
            price: parseFloat(data.price) || 0,
            date: new Date(data.date).toISOString().split('T')[0],
            notes: data.notes || '',
            taggedUsers: data.taggedUsers || []
        }

        const updatedTrip = { ...trips[activeTrip] };
        const newExpenses = updatedTrip.expenses || [];

        const sortedExpenses = [...newExpenses, newExpense].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        updatedTrip.expenses = sortedExpenses;

        const tripsCopy = [...trips];
        tripsCopy[activeTrip] = updatedTrip;

        setTrips(tripsCopy);
        localStorage.setItem("trips", JSON.stringify(tripsCopy));
    };  

     const handleUpdateExpense = (updatedExpense) => {
        const updatedTrip = { ...trips[activeTrip] };
        const expenses = updatedTrip.expenses || [];

        const updatedExpenses = expenses.map((e) =>
            e.id === updatedExpense.id ? updatedExpense : e
        );

        updatedTrip.expenses = updatedExpenses;

        const tripsCopy = [...trips];
        tripsCopy[activeTrip] = updatedTrip;
        setTrips(tripsCopy);
        localStorage.setItem("trips", JSON.stringify(tripsCopy));
    };


    // //for calculating expenses
    const tripExpenses = trips[activeTrip]?.expenses || [];

    const totalSpent = tripExpenses.reduce((sum, e) => sum + parseFloat(e.price), 0);

    //calculating by cat
    const spendingByActivity = tripExpenses.reduce((acc, e) => {
        acc[e.activity] = (acc[e.activity] || 0) + parseFloat(e.price);
        return acc;
    }, {});


    //for avg
    const numDays = Math.max(1, Math.ceil((new Date(trips[activeTrip]?.endDate) - new Date(trips[activeTrip]?.startDate)) / (1000 * 60 * 60 * 24)) + 1);

    //avg per day
    const avgPerDay = totalSpent / numDays;

    //daily spend track
    const spendPerDay = tripExpenses.reduce((acc, expense) => {
    const parsedDate = new Date(expense.date);
        if (isNaN(parsedDate)) {
            return acc;
        }

        const dateKey = parsedDate.toISOString().split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + (parseFloat(expense.price) || 0);
        return acc;
    }, {});


    //highest
    const maxSpend = Math.max(0, ...Object.values(spendPerDay));

    //to map icons
    const activityIcons = {
        flights: <Plane size={25} color="#4285f4"/>,
        lodging: <Hotel size={25} color="#34a853"/>,
        transportation: <Car size={25} color="#fbbc04"/>,
        dining: <Utensils size={25} color="#d93025"/>,
        shopping: <ShoppingBag size={25} color="#8B5CF6"/>,
        activities: <Ticket size={25} color="#EC4899"/>,
        other: <ReceiptText size={25} color="#F59E0B"/>
    }

    const activityColors = {
        flights: "#4285f4",
        lodging: "#34a853",
        transportation: "#fbbc04",
        dining: "#d93025",
        shopping: "#8B5CF6",
        activities: "#EC4899",
        other: "#F59E0B"
    }


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
                        <button className="new-trip-btn" onClick={openTripModal}>
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
                            src={`https://www.google.com/maps/embed/v1/view?key=${GCP_APIKEY1}&center=${trips[activeTrip].lat},${trips[activeTrip].lng}&zoom=12`}
                        />
                    </div>

                    <div className="trip-reservations">
                        <div className="reservation-header">
                            <h3 className="reservation-text">Reservations</h3>
                            <button className="add-btn" onClick={() => setShowReservationForm(true)}>
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
                            {reservations[activeReservation].length === 0 ? (
                                <p className="reservation-placeholder">No reservations yet. Start logging your trip!</p>
                                ) : (
                                <div className="reservation-list">
                                    {reservations[activeReservation].map((res, idx) => {
                                        if(activeReservation === "Flights"){
                                            return (
                                                <div className="reservation-card" key={idx} onClick={() => setEditReservation(res)}>
                                                    <div className="reservation-left">
                                                        <div className="reservation-icon">
                                                            <Plane className="plane-icon" size={25} color="#4285f4"/>
                                                        </div>
                                                        <div className="reservation-info">
                                                            <h4>Flight to {res.toAirport}</h4>
                                                            <h5>{res.fromAirport} &rarr; {res.toAirport} &bull; {new Date(res.arrivalDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })} &bull; {new Date(`1970-01-01T${res.arrivalTime}:00`).toLocaleTimeString([], {  hour: '2-digit', minute: '2-digit'})}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="reservation-right">
                                                        <div className="reservation-price">
                                                            <h4>${res.price}</h4>
                                                            <h5>{res.seatCategory}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        else if(activeReservation === "Lodging"){
                                            return (
                                                <div className="reservation-card" key={idx}>
                                                    <div className="reservation-left">
                                                        <div className="reservation-icon" id="hotel-bg">
                                                            <Hotel className="hotel-icon" size={25} color="#34a853"/>
                                                        </div>
                                                        <div className="reservation-info">
                                                            <h4>Stay at {res.name}</h4>
                                                            <h5>{res.address}</h5>
                                                            <h5>{new Date(res.checkIn).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })} &rarr; {new Date(res.checkOut).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="reservation-right">
                                                        <div className="reservation-price">
                                                            <h4>${res.price}</h4>
                                                            <h5>Total</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        else if(activeReservation === "Transportation"){
                                            return (
                                                <div className="reservation-card" key={idx}>
                                                    <div className="reservation-left">
                                                        <div className="reservation-icon" id="car-bg">
                                                            <Car className="car-icon" size={25} color="#fbbc04"/>
                                                        </div>
                                                        <div className="reservation-info">
                                                            <h4>{res.vehicle}</h4>
                                                            <h5>{res.provider}</h5>
                                                            <h5>{new Date(res.pickupDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })} &rarr; {new Date(res.dropoffDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="reservation-right">
                                                        <div className="reservation-price">
                                                            <h4>${res.price}</h4>
                                                            <h5>Total</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        else if(activeReservation === "Dining"){
                                            return (
                                                <div className="reservation-card" key={idx}>
                                                    <div className="reservation-left">
                                                        <div className="reservation-icon" id="dining-bg">
                                                            <Utensils className="dining-icon" size={25} color="#d93025"/>
                                                        </div>
                                                        <div className="reservation-info">
                                                            <h4>Eat at {res.restaurant}</h4>
                                                            <h5>{res.address}</h5>
                                                            <h5>{new Date(res.reservationDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit', })} &bull; {new Date(`1970-01-01T${res.reservationTime}:00`).toLocaleTimeString([], {  hour: '2-digit', minute: '2-digit'})}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="reservation-right">
                                                        <div className="reservation-price">
                                                            <h4>{res.partySize} People</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="trip-itinerary">
                        <div className="itinerary-header">
                            <h3>Itinerary</h3>
                        </div>
                        {Object.entries(trips[activeTrip].itinerary || {}).map(([date, activities], idx) => (
                            <div key={date} className="itinerary-day-block">
                                <div className="itinerary-day-header">
                                    <div className="itinerary-day">
                                        {idx + 1}
                                    </div>
                                    <div className="itinerary-date">
                                        <h4>{
                                            new Date(...date.split("-").map((v, i) => i === 1 ? v - 1 : +v))
                                            .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                                        }</h4>
                                    </div>
                                </div>

                                {activities.length === 0 ? (
                                    <button className="empty-itinerary-item" onClick={() => setSelectedDate(date)}>
                                        <div className="itinerary-plus">
                                            <Plus className="intinerary-plus" size={15}/>
                                        </div>
                                        <div className="itinerary-text">
                                            <p>Add activity</p>
                                        </div>
                                    </button>
                                ) : (
                                activities.map((act) => (
                                    <div key={act.id} className="itinerary-item">
                                        <p className="itinerary-time">
                                            <strong>{new Date(`1970-01-01T${act.time}:00`).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                            })}</strong>
                                        </p>
                                        <p className="itinerary-desc">{act.title}</p>
                                        {/* {act.notes && <p className="notes">{act.notes}</p>} */}

                                        <div className="itinerary-ellipse">
                                            <Ellipsis className="itinerary-extra" size={18} onClick={() => setShowDropdown(prev => (prev === act.id ? null : act.id))}/>

                                            {showDropdown === act.id && (
                                                <EllipseDropdown
                                                onEdit={() => setEditingActivity({ activity: act, dateKey: date })}
                                                onDelete={() => handleDeleteActivity(date, act.id)}
                                                />
                                            )}

                                        </div>
                                    </div>
                                    ))
                                )}
                                
                                {activities.length > 0 ? (
                                    <button className="empty-itinerary-item" onClick={() => setSelectedDate(date)}>
                                        <div className="itinerary-plus">
                                            <Plus className="intinerary-plus" size={15}/>
                                        </div>
                                        <div className="itinerary-text">
                                            <p>Add activity</p>
                                        </div>
                                    </button>
                                ) : ( null )}

                            </div>
                        ))}
                    </div>

                    <div className="trip-spending">
                        <div className="spending-header">
                            <h3 className="spending-text">Expenses</h3>
                            <button className="add-btn" onClick={() => setShowExpenseModal(true)}>
                                <h5>Add new</h5>
                            </button>
                        </div>
                        <div className="spending-summary">
                            <div className="total-spent">
                                <div className="total-spent-top">
                                    <div className="total-spent-details">
                                        <h5>Total Spent</h5>
                                        <h2>${totalSpent}</h2>   
                                    </div>
                                    <div className="reservation-icon" id="total-spent">
                                        <TrendingUp/>
                                    </div>
                                </div>
                                <div className="spend-analytics">
                                    <div className="average-spend">
                                        <div className="average-spend-card">
                                            <div className="average-spend-details">
                                                <h5>Highest</h5>
                                                <h3>${maxSpend.toFixed(2)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="average-spend">
                                        <div className="average-spend-card">
                                            <div className="average-spend-details">
                                                <h5>Average</h5>
                                                <h3>${avgPerDay.toFixed(2)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="spend-breakdown">
                                <div className="spend-breakdown-header">
                                    <h4>Category Breakdown</h4>
                                    <div className="reservation-icon" id="total-spent">
                                        <ShoppingBag/>
                                    </div>
                                </div>
                                <div className="spending-breakdown-details">
                                    {Object.keys(spendingByActivity).length === 0 ? (
                                        <p style={{ fontSize: '0.85rem', marginLeft: '10px', color: '#888' }}>
                                            No expenses yet — start tracking spending to see breakdown.
                                        </p>
                                    ) : (
                                        Object.entries(spendingByActivity).sort((a, b) => b[1] - a[1]).map(([activity, price]) => (
                                            <div key={activity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: "10px" }}>
                                                    <span style={{ color: activityColors[activity], fontSize: '2.5rem', lineHeight: '1.2rem', marginTop: '-6px' }}>&bull;</span>
                                                    <span style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{activity}</span>
                                                </div>
                                                <span style={{ fontWeight: '400', fontSize: '0.75rem', marginRight: "10px" }}>
                                                    ${price}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="expenses-details">
                            <div className="expenses-list">
                                {(trips[activeTrip]?.expenses || []).length === 0 ? (
                                    <div className="reservation-placeholder">
                                        <p>No expenses added yet. Start tracking your trip spending!</p>
                                    </div>
                                ) : (
                                    (trips[activeTrip]?.expenses || []).map((exp) => (
                                        <div key={exp.id} className="spending-item" onClick={() => setEditingExpense(exp)}>
                                            <div className="spending-left">
                                                <div className="reservation-icon" id={exp.activity?.toLowerCase()}>
                                                    {activityIcons[exp.activity]}
                                                </div>
                                                <div className="spending-info">
                                                    <h4>{exp.title}</h4>
                                                    <h5 className="spending-activity" style={{ textTransform: "capitalize" }}>
                                                        {exp.activity} &bull; {new Date(exp.date).toLocaleDateString()}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="spending-right">
                                                    <div className="spending-price">
                                                        <h4>${exp.price}</h4>
                                                    </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {editingActivity && (
                <EditItineraryModal
                    isOpen={true}
                    activity={editingActivity.activity}
                    dateKey={editingActivity.dateKey}
                    onClose={() => setEditingActivity(null)}
                    onSave={handleUpdateActivity}
                />
            )}
            <ReservationModal
                isOpen={showReservationForm}
                onClose={() => setShowReservationForm(false)}
                onSave={handleSaveReservation}
            />
            <ItineraryModal
                isOpen={selectedDate !== null}
                onClose={() => setSelectedDate(null)}
                onSave={(data) => handleAddActivity(selectedDate, data)}
            />
            <EditItineraryModal
                isOpen={editingActivity !== null}
                activity={editingActivity?.activity}
                dateKey={editingActivity?.dateKey}
                onClose={() => setEditingActivity(null)}
                onSave={handleUpdateActivity}
            />
            <TripPlanningModal
                isOpen={showNewTrip}
                onClose={closeTripModal}
                onSubmit={(data) => {
                    closeTripModal();
                    handleCreateTrip(data);
                }}
            />
            <ExpenseModal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                onSave={(data) => {
                    handleSaveExpense(data);
                    setShowExpenseModal(false);
                }}
            />
            {editingExpense && (
                <EditExpenseModal
                    isOpen={true}
                    expense={editingExpense}
                    onClose={() => setEditingExpense(null)}
                    onSave={handleUpdateExpense}
                />
            )}
            {editReservation && (
                <EditReservationModal
                    editingData={editReservation}
                    onSave={handleEditReservation}
                    onClose={() => setEditReservation(null)}
                />
            )}


        </div>
    )
}

export default TripStart;