import React, { useState, useRef, useEffect } from 'react';
import LoginModal from './loginModal';
import RegisterModal from './registerModal';
import { auth } from '../firebase';

const TripPlanningModal = ({ isOpen, onClose, onSubmit }) => {

  const [showLogin, setShowLogin] = useState(false);
  const [pendingTrip, setPendingTrip] = useState(null);
  const [authMode, setAuthMode] = useState('login');


  const destRef = useRef();
  useEffect(() => {
    if (
      !isOpen ||
      typeof window.google === 'undefined' ||
      !window.google.maps ||
      !window.google.maps.places ||
      !destRef.current
    ) {
      return;
    }

    let autocomplete;
    try {
      autocomplete = new window.google.maps.places.Autocomplete(
        destRef.current,
        { types: ['(cities)'] }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const location = place.geometry?.location;

        if (location) {
          setTripData(prev => ({
            ...prev,
            destination: place.formatted_address || place.name,
            lat: location.lat(),
            lng: location.lng()
          }));
        } else {
          console.warn("No geometry found for selected place.");
          setTripData(prev => ({
            ...prev,
            destination: place.formatted_address || place.name,
            lat: null,
            lng: null
          }));
        }
      });
    } catch (err) {
      console.error('Google Places Autocomplete init failed:', err);
    }
}, [isOpen]);


  const [tripData, setTripData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '2',
    budget: '0',
    lat: '', 
    lng: ''
  });

  const genItinerary = (startDateStr, endDateStr) => {
    const itinerary = {};
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toLocaleDateString('en-CA');
      itinerary[key] = [];
    }

    return itinerary;
  };


  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setTripData({
      ...tripData,
      [id.replace('trip-', '')]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...tripData,
      startDate: new Date(tripData.startDate),
      endDate: new Date(tripData.endDate),
      travelers: parseInt(tripData.travelers),
      budget: parseFloat(tripData.budget),
      notes: [],
      reservations: {},
      itinerary: genItinerary(tripData.startDate, tripData.endDate),
      expenses: [],
    };

    if (!auth.currentUser) {
      setPendingTrip(formattedData);
      setAuthMode('login'); // default to login
      setShowLogin(true);
      return;
    }

    onSubmit(formattedData);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (pendingTrip) {
      onSubmit(pendingTrip);
      setPendingTrip(null);
    }
  };



  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Let's plan your trip</div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form id="trip-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="trip-name">Trip Name</label>
            <input 
              type="text" 
              id="trip-name" 
              placeholder="Give your trip a name" 
              value={tripData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="trip-destination">Where are you going?</label>
            <input
              type="text"
              id="trip-destination"
              placeholder="Enter your destination"
              ref={destRef}
              value={tripData.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="trip-startDate">Start Date</label>
            <input 
              type="date" 
              id="trip-startDate" 
              value={tripData.startDate}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="trip-endDate">End Date</label>
            <input 
              type="date" 
              id="trip-endDate" 
              value={tripData.endDate}
              onChange={handleChange}
              required 
              min={tripData.startDate || undefined}
            />
          </div>
          <div className="form-group">
            <label htmlFor="trip-travelers">Number of Travelers</label>
            <select 
              id="trip-travelers" 
              value={tripData.travelers}
              onChange={handleChange}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Trip
          </button>
        </form>
      </div>
      {showLogin && (
        authMode === 'login' ? (
          <LoginModal
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
            switchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <RegisterModal
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
            switchToLogin={() => setAuthMode('login')}
          />
        )
      )}
    </div>
  );
};

export default TripPlanningModal;