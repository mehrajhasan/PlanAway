import React, { useState, useRef, useEffect } from 'react';

const TripPlanningModal = ({ isOpen, onClose, onSubmit }) => {
  // Form state
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
        console.warn("⚠️ No geometry found for selected place.");
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
    
    // Process data before submission
    const formattedData = {
      ...tripData,
      startDate: new Date(tripData.startDate),
      endDate: new Date(tripData.endDate),
      travelers: parseInt(tripData.travelers),
      budget: parseFloat(tripData.budget)
    };
    
    onSubmit(formattedData);
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
    </div>
  );
};

export default TripPlanningModal;