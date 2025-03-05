import React, { useState, useRef, useEffect } from 'react';
import './RoomBooking.css';
import { findBestRooms } from './findBestRooms';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomBooking = () => {
  const [rooms, setRooms] = useState(initializeRooms());
  const [bookedRooms, setBookedRooms] = useState([]);
  const [numRooms, setNumRooms] = useState();
  const [loading, setLoading] = useState(false);
  const [randomOccFlag, setRandomOccFlag] = useState(false);
  const [previousBookedRooms, setPreviousBookedRooms] = useState([]);

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
    const numberOfRooms = parseInt(numRooms);
    if (isNaN(numberOfRooms) || numberOfRooms < 1 || numberOfRooms > 5) {
        toast.error('Please enter a valid number of rooms between 1 and 5!');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      const bestRooms = findBestRooms(rooms, numberOfRooms);
      console.log(bestRooms);
      setLoading(false);

      if (!bestRooms) {
        toast.error('Sorry, We do not have enough rooms available to book for you!');
        return;
      }

      bestRooms.forEach(room => {
        room.booked = true;
      });

      setPreviousBookedRooms(bookedRooms);
      setBookedRooms([...bookedRooms, ...bestRooms]);
      setRooms({ ...rooms });
      toast.success('Rooms booked successfully!');
    }, 1000); // Simulate a delay for the loader
  
}

  function handleReset() {
    setRooms(initializeRooms());
    setBookedRooms([]);
    setPreviousBookedRooms([]);
    setNumRooms('');
    toast.info('Reset successful!');
  }

  function handleRandomOccupancy() {
    const newRooms = initializeRooms();
    for (let floor = 1; floor <= 10; floor++) {
      newRooms[floor].forEach(room => {
        room.booked = Math.random() < 0.5;
      });
    }
    setRooms(newRooms);
    setNumRooms('');
    if(randomOccFlag){
        toast.info('Random occupancy generated!');
    }
   
  }

useEffect(() => {
    handleRandomOccupancy();
    setRandomOccFlag(true);
}, []);

const handleKeyPress = (event) => {
    if (event.which === 13) {
        handleBooking();
    }
};


  

  

  return (
    <div className={`room-booking card ${loading ? 'disabled' : ''}`}>
      {loading && <div className="loader-overlay"><div className="loader"></div></div>}
      <div className="controls">
        <input
          type="number"
          value={numRooms}
          onChange={(e) => setNumRooms(e.target.value)}
          min="1"
          max="5"
          onKeyPress={handleKeyPress}
          placeholder="Enter number of rooms"
        />
        <button className="btn book-btn" onClick={handleBooking} disabled={loading}>
          {loading ? 'Booking...' : 'Book Rooms'}
        </button>
        <button className="btn" onClick={handleRandomOccupancy} disabled={loading}>
          Random Occupancy
        </button>
        <button className="btn" onClick={handleReset} disabled={loading}>
          Reset
        </button>
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
                    className={`room ${room.booked ? 'booked' : ''} ${previousBookedRooms.includes(room) ? 'previously-booked' : ''} ${bookedRooms.includes(room) ? 'newly-booked' : ''}`}
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
      
       <div className="legend card">
         <div className="legend-item">
         <div className="legend-box occupied"></div>
         <span>Occupied Rooms</span>
       </div>
       <div className="legend-item">
         <div className="legend-box available"></div>
         <span>Available Rooms</span>
       </div>
       <div className="legend-item">
         <div className="legend-box previously-booked"></div>
         <span>Already Booked by You</span>
       </div>
       <div className="legend-item">
         <div className="legend-box newly-booked"></div>
         <span>Your New Booking</span>
       </div>
       <div className="legend-item">
         <div className="legend-box stairs"></div>
         <span>Stairs</span>
       </div>
     </div>
     <ToastContainer />
     </div>
    );          
};

export default RoomBooking;