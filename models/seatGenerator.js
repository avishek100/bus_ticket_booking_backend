const createSeats = (capacity) => {
    let seats = [];
    const rows = Math.ceil(capacity / 2); // 2 seats per row per side (A & B)
    const cols = ["A", "B"]; // Two seat columns

    let seatIndex = 1;

    for (let i = 1; i <= rows; i++) {
        for (let col of cols) {
            if (seatIndex > capacity) break; // Stop if reached capacity
            let seatNumber = `${col}${i}`;
            seats.push({ number: seatNumber, booked: false });
            seatIndex++;
        }
    }
    return seats;
};

module.exports = createSeats;
