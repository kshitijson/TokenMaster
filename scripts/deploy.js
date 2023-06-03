const { ethers } = require("hardhat");

const costEthers = (n) => {
    return ethers.utils.parseUnits(String(n), "ether");
}

const main = async () => {

    const [master] = await ethers.getSigners();  // Get the master signer which is the owner

    const _name_ = "TokenMaster";  // Name pof the token
    const _symbol_ = "TM";   // Symbol of the token

    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    const tokenMaster = await TokenMaster.deploy(_name_, _symbol_)
    await tokenMaster.deployed();

    console.log(`Contract deployed at address ${tokenMaster.address}\n`)

    const events = [
        {
            name: "Oppenheimer",
            cost: costEthers(2),
            maxTickets: 200,
            date: "12 July",
            time: "10:00 PM IST",
            location: "PVR, Phoenix, Kurla"
        },
        {
            name: "K-POP concert",
            cost: costEthers(0.2),
            maxTickets: 0,
            date: "20 May",
            time: "5:00 PM IST",
            location: "DY Patil Stadium, Nerul"
        },
        {
            name: "Ballon Dor Ceremony",
            cost: costEthers(1),
            maxTickets: 500,
            date: "1 July",
            time: "7:00 PM CET",
            location: "Theatre du Chatelet, Paris"
        },
        {
            name: "UEFA Finals -- Manchester City vs Inter Milan",
            cost: costEthers(0.5),
            maxTickets: 800,
            date: "11 June",
            time: "9:00 PM CET",
            location: "Atatürk Olympic Stadium, Istanbul, Turkey"
        },
        {
            name: "MET Gala",
            cost: costEthers(3),
            maxTickets: 0,
            date: "10 May",
            time: "5:00 PM EST",
            location: "The Metropolitan Museum of Art, NYC"
        },
    ]

    for (let i = 0; i <= events.length-1; i++) {
        const transaction = await tokenMaster.connect(master).list(
            events[i].name,
            events[i].cost,
            events[i].maxTickets,
            events[i].date,
            events[i].time,
            events[i].location,
        )

        await transaction.wait()

        console.log(`Listed Event ${i + 1}: ${events[i].name}`)

    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });