import React, { useEffect, useState } from 'react';

const EditReservationModal = ({ isOpen, onClose, onSave, editingData }) => {
    const [type, setType] = useState('Flights');

    const [flightData, setFlightData] = useState({
        airline: '',
        flightNumber: '',
        fromAirport: '',
        toAirport: '',
        arrivalDate: '',
        arrivalTime: '',
        price: '',
        seat: '',
        seatCategory: ''
    });

  const [lodgingData, setLodgingData] = useState({
    name: '',
    address: '',
    checkIn: '',
    checkOut: '',
    price: '',
  });

  const [transportationData, setTransportationData] = useState({
    provider: '',
    vehicle: '',
    pickupDate: '',
    dropoffDate: '',
    price: ''
  });

  const [diningData, setDiningData] = useState({
    restaurant: '',
    address: '',
    reservationDate: '',
    reservationTime: '',
    partySize: ''
  });

  if (!editingData) return null;

    useEffect(() => {
        if (!editingData) return;

        setType(editingData.type);

        switch (editingData.type) {
            case 'Flights': setFlightData({ ...editingData }); break;
            case 'Lodging': setLodgingData({ ...editingData }); break;
            case 'Transportation': setTransportationData({ ...editingData }); break;
            case 'Dining': setDiningData({ ...editingData }); break;
            default: break;
        }
    }, [editingData]);

  const handleChange = (e, setter, data) => {
    setter({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    let data;
    switch (type) {
        case 'Flights':
            data = { ...flightData, type };
            break;
        case 'Lodging':
            data = { ...lodgingData, type };
            break;
        case 'Transportation':
            data = { ...transportationData, type };
            break;
        case 'Dining':
            data = { ...diningData, type };
            break;
        default:
            return;
    }
    
    if (editingData?.id) {
        data.id = editingData.id;
    }
    onSave(data);
    onClose();

    setFlightData({ airline: '', flightNumber: '', fromAirport: '', fromInfo: '', toAirport: '', toInfo: '', price: '', seat: '', seatCategory: '' });
    setLodgingData({ name: '', address: '', checkIn: '', checkOut: '', price: '' });
    setTransportationData({ provider: '', vehicle: '', pickupDate: '', dropoffDate: '', price: '' });
    setDiningData({ restaurant: '', address: '', reservationDate: '', reservationTime: '', partySize: '' });
};


  const renderFields = () => {
    switch (type) {
      case 'Flights':
        return (
          <>
            <input name="airline" value={flightData.airline} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="Airline" required/>
            <input name="flightNumber" value={flightData.flightNumber} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="Flight Number" required/>
            <input name="fromAirport" value={flightData.fromAirport} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="From Airport" required/>
            <input name="toAirport" value={flightData.toAirport} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="To Airport" required/>
            <input name="arrivalDate" type="date" value={flightData.arrivalDate} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="Arrival Date" required/>
            <input name="arrivalTime" type="time" value={flightData.arrivalTime} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="Arrival Time" required/>
            <input name="price" value={flightData.price} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="Price" required/>
            <input name="seatCategory" value={flightData.seatCategory} onChange={(e) => handleChange(e, setFlightData, flightData)} placeholder="Seat Category" required/>

          </>
        );
      case 'Lodging':
        return (
          <>
            <input name="name" value={lodgingData.name} onChange={(e) => handleChange(e, setLodgingData, lodgingData)} placeholder="Lodging Name" required/>
            <input name="address" value={lodgingData.address} onChange={(e) => handleChange(e, setLodgingData, lodgingData)} placeholder="Address" required/>
            <input name="checkIn" type="date" value={lodgingData.checkIn} onChange={(e) => handleChange(e, setLodgingData, lodgingData)} required/>
            <input name="checkOut" type="date" value={lodgingData.checkOut} onChange={(e) => handleChange(e, setLodgingData, lodgingData)} required/>
            <input name="price" value={lodgingData.price} onChange={(e) => handleChange(e, setLodgingData, lodgingData)} placeholder="Price" required/>
          </>
        );
      case 'Transportation':
        return (
          <>
            <input name="provider" value={transportationData.provider} onChange={(e) => handleChange(e, setTransportationData, transportationData)} placeholder="Rental Provider" required/>
            <input name="vehicle" value={transportationData.vehicle} onChange={(e) => handleChange(e, setTransportationData, transportationData)} placeholder="Vehicle" required/>
            <input name="pickupDate" type="date" value={transportationData.pickupDate} onChange={(e) => handleChange(e, setTransportationData, transportationData)} required/>
            <input name="dropoffDate" type="date" value={transportationData.dropoffDate} onChange={(e) => handleChange(e, setTransportationData, transportationData)} required/>
            <input name="price" value={transportationData.price} onChange={(e) => handleChange(e, setTransportationData, transportationData)} placeholder="Price" required/>
          </>
        );
      case 'Dining':
        return (
          <>
            <input name="restaurant" value={diningData.restaurant} onChange={(e) => handleChange(e, setDiningData, diningData)} placeholder="Restaurant" required/>
            <input name="address" value={diningData.address} onChange={(e) => handleChange(e, setDiningData, diningData)} placeholder="Address" required/>
            <input name="reservationDate" type="date" value={diningData.reservationDate} onChange={(e) => handleChange(e, setDiningData, diningData)} required/>
            <input name="reservationTime" type="time" value={diningData.reservationTime} onChange={(e) => handleChange(e, setDiningData, diningData)} required/>
            <input name="partySize" value={diningData.partySize} onChange={(e) => handleChange(e, setDiningData, diningData)} placeholder="Party Size" required/>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <div className="reservation-modal-header">
          <h2 className="reservation-modal-title">Edit a reservation</h2>
          <button className="reservation-close-btn" onClick={onClose}>&times;</button>
        </div>
        <form id="expense-form">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Flights">Flights</option>
            <option value="Lodging">Lodging</option>
            <option value="Transportation">Transportation</option>
            <option value="Dining">Dining</option>
          </select>

          {renderFields()}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', margin: '10px' }} onClick={handleSave}>
            Save Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
