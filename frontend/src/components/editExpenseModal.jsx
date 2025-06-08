import React, { useEffect, useState } from 'react';

const EditExpenseModal = ({ isOpen, onClose, onSave, expense }) => {
  const [expenseData, setExpenseData] = useState({
    title: '',
    activity: '',
    price: '',
    notes: '',
    date: '',
    taggedUsers: '',
  });

  useEffect(() => {
      if (expense) {
        setExpenseData({
          title: expense.title || '',
          activity: expense.activity || '',
          price: expense.price || '',
          notes: expense.notes || '',
          date: expense.date || '',
          taggedUsers: expense.taggedUsers
        });
      }
    }, [expense]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updated = {
        ...expense,
        ...expenseData,
    };

    onSave(updated);
    onClose();

    setExpenseData({ title: '', activity: '', price: '', date: '', notes: '', taggedUsers: '' });
  };

  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <div className="reservation-modal-header">
          <h2 className="reservation-modal-title">Edit an expense</h2>
          <button className="reservation-close-btn" onClick={onClose}>&times;</button>
        </div>
        <form id="expense-form" onSubmit={handleSave}>
            <select 
                name="activity" 
                value={expenseData.activity}
                onChange={handleChange}
                required
            >
                <option value="" disabled>Select category</option>
                <option value="flights">Flights</option>
                <option value="lodging">Lodging</option>
                <option value="transportation">Transportation</option>
                <option value="dining">Dining</option>
                <option value="shopping">Shopping</option>
                <option value="activities">Activities</option>
                <option value="other">Other</option>
            </select>
            <input
            name="title"
            placeholder="Description"
            value={expenseData.title}
            onChange={handleChange}
            required
            />
            <input
            name="price"
            placeholder="Price"
            value={expenseData.price}
            onChange={handleChange}
            required
            />
            <input
            name="date"
            type="date"
            value={expenseData.date}
            onChange={handleChange}
            required
            />
            <input
            name="notes"
            placeholder="Notes"
            value={expenseData.notes}
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

export default EditExpenseModal;
