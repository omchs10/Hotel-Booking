import React from 'react';
import './App.css';
import RoomBooking from './component/roomBooking';

function App() {
  return (
    <div className="App">
      <div className="header-card">
        <div className="fixed-head-sticky">
          <h4 className="heading">Hotel Booking</h4>
        </div>
      </div>
      <div className="Main">
        <RoomBooking />
      </div>
    </div>
  );
}

export default App;