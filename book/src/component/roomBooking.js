import React, { useState } from 'react';
import './RoomBooking.css';
import { findBestRooms } from './findBestRooms';

const RoomBooking = () => {
  const [rooms, setRooms] = useState(initializeRooms());
  const [bookedRooms, setBookedRooms] = useState([]);
  const [numRooms, setNumRooms] = useState();

  function initializeRooms() {
    const rooms = {};
    for (let floor = 1; floor <= 10; floor++) {
      rooms[floor] = [];
      const numRooms = floor === 10 ? 7 : 10;
      for (let room = 1; room <= numRooms; room++) {
        rooms[floor].push({ number: floor * 100 + room, booked: false });
      }
    }
    return rooms;
  }

  function handleBooking() {
    const bestRooms = findBestRooms(rooms, numRooms);
    if (!bestRooms) {
      alert('Not enough rooms available');
      return;
    }

    bestRooms.forEach(room => {
      room.booked = true;
    });

    setBookedRooms([...bookedRooms, ...bestRooms]);
    setRooms({ ...rooms });
  }

  function handleReset() {
    setRooms(initializeRooms());
    setBookedRooms([]);
  }

  function handleRandomOccupancy() {
    const newRooms = initializeRooms();
    for (let floor = 1; floor <= 10; floor++) {
      newRooms[floor].forEach(room => {
        room.booked = Math.random() < 0.5;
      });
    }
    setRooms(newRooms);
  }

  return (
    <div className="room-booking card">
      <div className="controls">
        <input
          type="number"
          value={numRooms}
          onChange={(e) => setNumRooms(parseInt(e.target.value))}
          min="1"
          max="5"
          placeholder="Enter number of rooms"
        />
        <button className="btn book-btn" onClick={handleBooking}>Book Rooms</button>
        <button className="btn" onClick={handleRandomOccupancy}>Random Occupancy</button>
        <button className="btn" onClick={handleReset}>Reset</button>
      </div>
      <div className="building">
        <div className="staircase-lift">
          {Array.from({ length: 43 }).map((_, index) => (
            <div key={index} className="brick"></div>
          ))}
        </div>
        <div className="floors">
          {Object.keys(rooms).reverse().map(floor => (
            <div key={floor} className="floor">
              <div className="rooms">
                {rooms[floor].map(room => (
                  <div
                    key={room.number}
                    className={`room ${room.booked ? 'booked' : ''} ${bookedRooms.includes(room) ? 'newly-booked' : ''}`}
                  >
                    {room.number}
                  </div>
                ))}
              </div>
              <div className="floor-label">Floor {floor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomBooking;