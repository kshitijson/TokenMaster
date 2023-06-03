const { expect } = require("chai");
const { ethers } = require("hardhat")

const NAME = "TokenMaster"
const SYMBOL = "TM"

describe("TokenMaster", () => {

  let tokenMaster;
  let provider;
  let buyer;

  const EVENT_NAME = "Pratishtha";
  const EVENT_COST = ethers.utils.parseUnits('0.2', 'ether');
  const EVENT_MAX_TICKETS = 100;
  const EVENT_DATE = "March 09";
  const EVENT_TIME = "10:00 AM IST";
  const EVENT_LOCATION = "SAKEC Campus, Govandi";
  

  beforeEach(async () => {

    [provider, buyer] = await ethers.getSigners();  // accounts addresses
    const TokenMaster = await ethers.getContractFactory("TokenMaster");  // locating the  smart contract TokenMaster
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);  // deployong smart contract and initializing it to tokenMaster for accessing the deployed SC

    // tokenMaster.connect  ==>  connect to the deployed smart contract for accessing smart contract functions eg. list()

    let transaction = await tokenMaster.connect(provider).list(
      EVENT_NAME,
      EVENT_COST,
      EVENT_MAX_TICKETS,
      EVENT_DATE,
      EVENT_TIME,
      EVENT_LOCATION
    )

    // .wait()  ==>  waits till the transaction is included in a block and added to the blockchain
    await transaction.wait()
  })

  describe("deployment", () => {

    it("Sets the name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME);
    })

    it("Sets the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL);
    })

    it("Sets owner", async () => {
      expect(await tokenMaster.owner()).to.equal(provider.address)
    })
  })

  describe("events", () => {
    it("sets events", async () => {
      expect(await tokenMaster.totalEvents()).to.equal(1)
    })

    it("event list printed", async () => {
      let eventss = await tokenMaster.getEvent(1);
      console.log(eventss.id);
      console.log(eventss.name);
      console.log(eventss.cost);
      console.log(eventss.maxTickets);
      console.log(eventss.date);
      console.log(eventss.time);
      console.log(eventss.location);
      console.log(eventss.tickets);
    })
  })

  describe("Minting", () => {

    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('0.2', 'ether');

    beforeEach(async () => {
      let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
      await transaction.wait()
    })

    it("seats updated", async () => {
      let seats = await tokenMaster.getEvent(ID);
      expect(seats.tickets).to.equal(99); 
    })

    it("seat owner", async () => {
      let seatOwner = await tokenMaster.seatTaken(ID, SEAT);
      expect(seatOwner).to.equal(buyer.address);
    })

    it("has booked", async () => {
      expect(await tokenMaster.hasBooked(ID, buyer.address)).to.equal(true)
    })

    it("seats taken", async () => {
      let seatsTaken = await tokenMaster.getSeats(ID);
      console.log(seatsTaken);
      expect(seatsTaken.length).to.equal(1);
      expect(seatsTaken[0]).to.equal(SEAT);
    })

    it("balance", async () => {
      let balance = await ethers.provider.getBalance(tokenMaster.address)
      console.log(await ethers.utils.formatUnits(balance, 'ether'));
      expect(balance).to.equal(AMOUNT);
    })

  })

  describe("Withdrawing", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('0.2', 'ether');
    let providerBalance;
    
    beforeEach(async () => {
      providerBalance = await ethers.provider.getBalance(provider.address);
      let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
      await transaction.wait()

      transaction  =await tokenMaster.connect(provider).withdraw();
      await transaction.wait();
    })

    it("Provider balance updated", async () => {
      expect(await ethers.provider.getBalance(provider.address)).to.be.greaterThan(providerBalance)
    })

    it("Smart contract address", async () => {
      expect(await ethers.provider.getBalance(tokenMaster.address)).to.equal(0);
    })
  })
  
})