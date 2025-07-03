import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { BarChart3, TrendingUp, Trash2, User, Plus, Bell, Settings, Plane, DollarSign, Globe, Clock, MapPin, Calendar, Users, Star } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        console.warn("User not set yet, skipping fetchTrips");
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) return;

        const userData = userDocSnap.data();
        const tripIds = userData?.trips || [];

        const tripSnaps = await Promise.all(
          tripIds.map((id) => getDoc(doc(db, 'trips', id)))
        );

        const trips = tripSnaps
          .filter((snap) => snap.exists())
          .map((snap) => ({ id: snap.id, ...snap.data() }));

        setUserTrips(trips);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      }

      setLoading(false);
    };

    fetchTrips();
  }, [user]);

  const handleDeleteTrip = async (tripId) => {
    if (!user) return;

    const confirm = window.confirm("Delete this trip?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "trips", tripId));
      // also update user doc to remove tripId
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const updatedTrips = (userData.trips || []).filter(id => id !== tripId);
      await updateDoc(userRef, { trips: updatedTrips });

      setUserTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };


  const travelStats = {
    totalTrips: userTrips.length,
    totalSpent: userTrips.reduce((sum, t) => sum + (t.totalCost || 0), 0),
    countriesVisited: new Set(userTrips.map(t => t.country)).size,
    avgTripDuration: (() => {
    const validDurations = userTrips
        .map(t => {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        const duration = (end - start) / (1000 * 60 * 60 * 24);
        return isNaN(duration) || duration <= 0 ? null : duration;
        })
        .filter(Boolean);

    if (validDurations.length === 0) return null;

    const avg = validDurations.reduce((sum, d) => sum + d, 0) / validDurations.length;
    return avg.toFixed(1);
    })(),
    currentYear: {
      trips: userTrips.filter(t => new Date(t.startDate).getFullYear() === new Date().getFullYear()).length,
      spending: userTrips.filter(t => new Date(t.startDate).getFullYear() === new Date().getFullYear()).reduce((sum, t) => sum + (t.totalCost || 0), 0)
    },
    lastYear: {
      trips: userTrips.filter(t => new Date(t.startDate).getFullYear() === new Date().getFullYear() - 1).length,
      spending: userTrips.filter(t => new Date(t.startDate).getFullYear() === new Date().getFullYear() - 1).reduce((sum, t) => sum + (t.totalCost || 0), 0)
    }
  };

  const upcomingTrips = userTrips
    .filter(t => {
      const tripStart = t.startDate?.toDate?.() || new Date(t.startDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return tripStart >= now;
    })
    .map(t => {
      const start = t.startDate?.toDate?.() || new Date(t.startDate);
      const end = t.endDate?.toDate?.() || new Date(t.endDate);
      return {
        ...t,
        daysUntil: Math.ceil((start - new Date()) / (1000 * 60 * 60 * 24)),
        duration: `${Math.ceil((end - start) / (1000 * 60 * 60 * 24))} days`,
        weather: t.weather || "N/A",
        image: t.imageUrl || "🌍",
        groupSize: `${t.group?.length || 1} travelers`
      };
    })
    .sort((a, b) => {
  const aDate = a.startDate?.toDate?.() || new Date(a.startDate);
  const bDate = b.startDate?.toDate?.() || new Date(b.startDate);
  return aDate - bDate;
});

      const recentTrips = userTrips
    .filter(t => new Date(t.endDate) < new Date())
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
    .slice(0, 3)
    .map(t => ({
      name: t.name,
      location: t.location,
      rating: t.rating || 4.5,
      spent: t.totalCost || 0
    }));

  const spendingByCategory = Object.entries(userTrips.reduce((acc, trip) => {
    (trip.expenses || []).forEach(exp => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    });
    return acc;
  }, {})).map(([category, amount]) => ({
    category,
    amount,
    percentage: ((amount / travelStats.totalSpent) * 100).toFixed(0)
  })).sort((a, b) => b.amount - a.amount);

  if (loading || !user) {
    return (
      <div className="dashboard-main">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <div className="top-nav">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="logo">PlanAway</h1>
          </div>
          <div className="nav-right">
            <button className="nav-icon-button"><Bell size={20} /></button>
            <button className="nav-icon-button"><Settings size={20} /></button>
            <div className="user-avatar"><User size={16} /></div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome back, Traveler! ✈️</h2>
          <p className="welcome-subtitle">Here's your travel summary and what's coming up next.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-header">
              <div className="reservation-icon" id="adventures"><Plane size={24} /></div>
              <div className="stat-change">
                <div className="stat-change-label">This Year</div>
                <div className="stat-change-value">
                  +{travelStats.currentYear.trips - travelStats.lastYear.trips}
                </div>
              </div>
            </div>
            <div className="stat-number">{travelStats.totalTrips}</div>
            <div className="stat-label">Total Adventures</div>
          </div>

          <div className="stat-card green">
            <div className="stat-header">
              <div className="reservation-icon" id="invested"><DollarSign size={24} /></div>
              <div className="stat-change">
                <div className="stat-change-label">vs Last Year</div>
                <div className="stat-change-value">
                  {travelStats.currentYear.spending > travelStats.lastYear.spending ? '+' : ''}
                  ${((travelStats.currentYear.spending - travelStats.lastYear.spending) / 1000).toFixed(1)}k
                </div>
              </div>
            </div>
            <div className="stat-number">${(travelStats.totalSpent / 1000).toFixed(1)}k</div>
            <div className="stat-label">Total Invested</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-header">
            <div className="reservation-icon" id="trips">
                <MapPin size={24} />
            </div>
            <div className="stat-change">
                <div className="stat-change-label">Next In</div>
                <div className="stat-change-value">
                {upcomingTrips[0]?.daysUntil || '–'} days
                </div>
            </div>
            </div>
            <div className="stat-number" id="next-trip">
                {upcomingTrips[0]?.destination || upcomingTrips[0]?.location || 'No trip'}
            </div>
            <div className="stat-label">Upcoming Trip</div>
        </div>
        </div>

        <div className="main-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Next Adventures</h3>
                <p className="card-subtitle">Your upcoming travel plans</p>
              </div>
              <div>
                <button className="new-trip-btn" id="new-trip-dash">
                    <Plus className="plus-icon" size={16}/>
                    <span>New Trip</span>
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="trips-list">
                {upcomingTrips.map((trip, index) => (
                  <div key={trip.id} className="trip-card clickable" onClick={() => navigate(`/trip/${trip.id}`)}>
                    <div className="trip-flag">
                        {trip.image.startsWith('http') ? (
                            <img src={trip.image} alt={trip.name} className="dash-trip-pic" />
                        ) : (
                            <span>{trip.image}</span>
                        )}
                    </div>
                    <div className="trip-details">
                      <div className="trip-header">
                        <div className="trip-subheader">
                          <h4 className="trip-name">{trip.name}</h4>
                          <p className="trip-location">
                            <MapPin size={16} />
                            {trip.destination}
                          </p>
                        </div>
                        <div className="trip-badge">{trip.daysUntil} days to go</div>
                      </div>
                      <div className="trip-info-container">
                        <div className="trip-info-grid">
                          <div className="trip-info-item">
                            <Calendar size={16} />
                            <span>{trip.duration}</span>
                          </div>
                          <div className="trip-info-item">
                            <Users size={16} />
                            <span>{trip.travelers} travelers</span>
                          </div>
                        </div>
                        <div className="trip-info-delete">
                          <button onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteTrip(trip.id);
                          }}
                          className="delete-button" style={{background: "none",border: "none"}}>
                            <Trash2 size={15} color="red"/>
                          </button>
                        </div>
                      </div>
                    </div>
                    {index === 0 && <div className="next-trip-badge">Next Up!</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Trip Highlights</h3>
              <p className="card-subtitle">How your latest adventures performed</p>
            </div>
          </div>
          <div className="card-content">
            <div className="recent-trips-grid">
              {recentTrips.map((trip, index) => (
                <div key={index} className="recent-trip-card">
                  <div className="recent-trip-header">
                    <div>
                      <h4 className="recent-trip-name">{trip.name}</h4>
                      <p className="recent-trip-location">{trip.location}</p>
                    </div>
                    <div className="recent-trip-rating">
                      <Star size={16} fill="currentColor" />
                      <span>{trip.rating}</span>
                    </div>
                  </div>
                  <div className="recent-trip-spent">
                    ${trip.spent.toLocaleString()}
                  </div>
                  <div className="recent-trip-label">Total spent</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
