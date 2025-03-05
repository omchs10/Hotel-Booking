export function findBestRooms(rooms, numRooms) {
    const availableRooms = [];
    for (let floor = 1; floor <= 10; floor++) {
      availableRooms.push(...rooms[floor].filter(room => !room.booked));
    }
  
    if (availableRooms.length < numRooms) {
      return null;
    }
  
    // Group available rooms by floor
    const roomsByFloor = {};
    availableRooms.forEach(room => {
      const floor = Math.floor(room.number / 100);
      if (!roomsByFloor[floor]) {
        roomsByFloor[floor] = [];
      }
      roomsByFloor[floor].push(room);
    });
  
    // Try to find rooms on the same floor
    for (let floor = 1; floor <= 10; floor++) {
      if (roomsByFloor[floor] && roomsByFloor[floor].length >= numRooms) {
        return roomsByFloor[floor].slice(0, numRooms);
      }
    }
  
    // If not enough rooms on the same floor, find the best combination across floors
    const bestCombination = [];
    let minTravelTime = Infinity;
  
    function findCombination(currentCombination, remainingRooms, currentTravelTime) {
      if (currentCombination.length === numRooms) {
        if (currentTravelTime < minTravelTime) {
          minTravelTime = currentTravelTime;
          bestCombination.length = 0;
          bestCombination.push(...currentCombination);
        }
        return;
      }
  
      for (let i = 0; i < remainingRooms.length; i++) {
        const nextRoom = remainingRooms[i];
        const nextCombination = [...currentCombination, nextRoom];
        const nextRemainingRooms = remainingRooms.slice(i + 1);
        const nextTravelTime = calculateTravelTime(nextCombination);
        findCombination(nextCombination, nextRemainingRooms, nextTravelTime);
      }
    }
  
    findCombination([], availableRooms, 0);
    return bestCombination;
  }
  
  function calculateTravelTime(rooms) {
    if (rooms.length < 2) return 0;
  
    let travelTime = 0;
    for (let i = 1; i < rooms.length; i++) {
      const prevRoom = rooms[i - 1];
      const currRoom = rooms[i];
      const prevFloor = Math.floor(prevRoom.number / 100);
      const currFloor = Math.floor(currRoom.number / 100);
      const prevRoomNumber = prevRoom.number % 100;
      const currRoomNumber = currRoom.number % 100;
  
      if (prevFloor === currFloor) {
        travelTime += Math.abs(currRoomNumber - prevRoomNumber);
      } else {
        travelTime += Math.abs(currFloor - prevFloor) * 2;
      }
    }
  
    return travelTime;
  }