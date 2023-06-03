const Seat = ({ i, step, columnStart, maxColumns, rowStart, maxRows, seatsTaken, buyHandler }) => {
    return (
        <div
            onClick={() => buyHandler(i + step)}
            className={seatsTaken.find(seat => Number(seat) == i + step) ? "event__seats--taken" : "event__seats"}
            style={{
                gridColumn: `${((i % maxColumns) + 1) + columnStart}`,
                gridRow: `${Math.ceil(((i + 1) / maxRows)) + rowStart}`
            }}
        >
            {i + step}
        </div>
    );
}

export default Seat;