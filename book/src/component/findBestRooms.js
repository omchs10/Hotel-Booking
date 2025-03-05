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

  // If not enough rooms on the same floor, find the best combination across floors using dynamic programming
  const dp = Array(availableRooms.length + 1).fill(null).map(() => Array(numRooms + 1).fill(Infinity));
  const path = Array(availableRooms.length + 1).fill(null).map(() => Array(numRooms + 1).fill(null));

  dp[0][0] = 0;

  for (let i = 1; i <= availableRooms.length; i++) {
    for (let j = 1; j <= numRooms; j++) {
      for (let k = 0; k < i; k++) {
        const travelTime = calculateTravelTime(availableRooms.slice(k, i));
        if (dp[k][j - 1] + travelTime < dp[i][j]) {
          dp[i][j] = dp[k][j - 1] + travelTime;
          path[i][j] = k;
        }
      }
    }
  }

  let minTravelTime = Infinity;
  let bestEnd = -1;

  for (let i = 1; i <= availableRooms.length; i++) {
    if (dp[i][numRooms] < minTravelTime) {
      minTravelTime = dp[i][numRooms];
      bestEnd = i;
    }
  }

  const bestCombination = [];
  let current = bestEnd;
  let remainingRooms = numRooms;

  while (remainingRooms > 0) {
    const start = path[current][remainingRooms];
    bestCombination.unshift(...availableRooms.slice(start, current));
    current = start;
    remainingRooms--;
  }

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
      travelTime += Math.abs(currRoomNumber + prevRoomNumber) - 1;
    }
  }

  return travelTime;
}