import { ethers } from 'ethers'

const Card = ({ event, toggle, setToggle, setEvent }) => {
  const togglePop = () => {
    setEvent(event)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{event.date}</strong><br />{event.time}
        </p>

        <h3 className='card__name'>
          {event.name}
        </h3>

        <p className='card__location'>
          <small>{event.location}</small>
        </p>

        <p className='card__cost'>
          <strong>
            {ethers.utils.formatUnits(event.cost.toString(), 'ether')}
          </strong>
          ETH
        </p>

        {event.tickets.toString() === "0" ? (
          <button
            type="button"
            className='card__button--out'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className='card__button'
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>

      <hr />
    </div >
  );
}

export default Card;