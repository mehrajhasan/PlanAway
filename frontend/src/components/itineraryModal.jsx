import React, { useState } from 'react';

const ItineraryModal = ({ isOpen, onClose, onSave }) => {
  const [activityData, setActivityData] = useState({
    title: '',
    time: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const data = {
      ...activityData,
    };

    onSave(data);
    onClose();

    setActivityData({ title: '', time: '', notes: '' });
  };

  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <div className="reservation-modal-header">
          <h2 className="reservation-modal-title">Add an activity</h2>
          <button className="reservation-close-btn" onClick={onClose}>&times;</button>
        </div>
        <form id="expense-form" onSubmit={handleSave}>
          <input
            name="title"
            placeholder="Activity Title"
            value={activityData.title}
            onChange={handleChange}
            required
          />
          <input
            name="time"
            type="time"
            value={activityData.time}
            onChange={handleChange}
            required
          />
          <input
            name="notes"
            placeholder="Notes"
            value={activityData.notes}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', margin: '10px' }}
            onClick={handleSave}
          >
            Save Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItineraryModal;
