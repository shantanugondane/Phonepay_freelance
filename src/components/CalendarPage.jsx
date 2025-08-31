import React, { useState } from 'react';

const CalendarPage = ({ isActive }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [events, setEvents] = useState([
    { title: 'Quarterly Townhall', start: '2024-07-15T16:00:00', color: '#5F259F' },
    { title: 'Independence Day (Holiday)', start: '2024-08-15', allDay: true, color: '#4ECDC4' },
    { title: 'Team Building Retreat', start: '2024-09-05', color: '#FF6B6B' },
    { title: 'Gandhi Jayanti (Holiday)', start: '2024-10-02', allDay: true, color: '#FF8E8E' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.date && formData.time) {
      const newEvent = {
        title: formData.title,
        start: `${formData.date}T${formData.time}`,
        color: '#5F259F'
      };
      setEvents(prev => [...prev, newEvent]);
      setFormData({ title: '', date: '', time: '' });
      setShowBookingModal(false);
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setFormData({ title: '', date: '', time: '' });
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <div className="breadcrumb">Dashboard / Calendar</div>
        </div>
        <button 
          id="new-booking-btn" 
          style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '10px 18px', 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: '500', 
            fontSize: '15px', 
            cursor: 'pointer'
          }}
          onClick={() => setShowBookingModal(true)}
        >
          + Add Event
        </button>
      </div>
      
      {/* Simple Calendar Display */}
      <div id="fullcalendar" style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px 0 rgba(95, 37, 159, 0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)',
        padding: '24px',
        minHeight: '650px'
      }}>
        <h3 style={{marginBottom: '20px', color: 'var(--text-primary)'}}>Calendar Events</h3>
        <div style={{display: 'grid', gap: '12px'}}>
          {events.map((event, index) => (
            <div 
              key={index}
              style={{
                background: event.color,
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{fontWeight: '500'}}>{event.title}</span>
              <span style={{fontSize: '14px', opacity: '0.9'}}>
                {event.allDay ? event.start : new Date(event.start).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <h2>New Booking</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="title"
                placeholder="Event Title" 
                required 
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  fontFamily: "'Poppins', sans-serif"
                }} 
              />
              <input 
                type="date" 
                name="date"
                required 
                value={formData.date}
                onChange={handleInputChange}
                style={{
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  fontFamily: "'Poppins', sans-serif"
                }} 
              />
              <input 
                type="time" 
                name="time"
                required 
                value={formData.time}
                onChange={handleInputChange}
                style={{
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '18px', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border)', 
                  fontFamily: "'Poppins', sans-serif"
                }} 
              />
              <button 
                type="submit" 
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '10px 18px', 
                  fontFamily: "'Poppins', sans-serif", 
                  fontWeight: '500', 
                  fontSize: '15px', 
                  cursor: 'pointer'
                }}
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
