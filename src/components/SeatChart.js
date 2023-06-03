import { useEffect, useState } from 'react'
import { message } from 'antd'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'

const SeatChart = ({ event, tokenMaster, provider, setToggle }) => {

  const [messageApi, contextHolder] = message.useMessage()

  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMaster.getSeats(event.id)
    setSeatsTaken(seatsTaken)
  }

  const buyHandler = async (_seat) => {
    setHasSold(false)

    try {
      const signer = await provider.getSigner()
      const transaction = await tokenMaster.connect(signer).mint(event.id, _seat, { value: event.cost })
      await transaction.wait()
      messageApi.open({
        type: 'success',
        content: 'Seat booked successfully',
      });
      setHasSold(true)
    } catch (error) {
      if (error.code === 4001) {
        console.log("transaction rejected")
        setHasSold(false)
      }
    }

  }

  useEffect(() => {
    getSeatsTaken()
  }, [hasSold])

  return (
    <>
    {contextHolder}
    <div className="event">
      <div className="event__seating">
        <h1>{event.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="event__close">
          <img src={close} alt="Close" />
        </button>

        <div className="event__stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="event__spacer--1 ">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(event.maxTickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="event__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(event.maxTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  </>
  );
}

export default SeatChart;