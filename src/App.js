import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Alert, Space } from 'antd';

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TokenMaster from './abis/TokenMaster.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [tokenMaster, setTokenMaster] = useState(null)
  const [events, setEvents] = useState([])

  const [event, setEvent] = useState({})
  const [toggle, setToggle] = useState(false)

  const [err, setErr] = useState(null)

  const loadBlockchainData = async () => {
    setErr(null);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const tokenMaster = new ethers.Contract(config[network.chainId].TokenMaster.address, TokenMaster, provider)
    setTokenMaster(tokenMaster)

    const totalEvents = await tokenMaster.totalEvents()
    const events = []

    for (var i = 1; i <= totalEvents; i++) {
      const event = await tokenMaster.getEvent(i)
      events.push(event)
    }

    setEvents(events)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const handleNavbarError = () => {
    setErr(
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <Alert
        message="Error fetching account data"
        description="Check if you have logged in to metamask"
        type="warning"
        showIcon
        closable
      />
    </Space>
    )
  }

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} onError={handleNavbarError}/>

        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      <div>
        {err}
      </div>

      <Sort />

      <div className='cards'>
        {events.map((event, index) => (
          <Card
            event={event}
            id={index + 1}
            tokenMaster={tokenMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setEvent={setEvent}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          event={event}
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;