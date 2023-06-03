// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {    

    address public owner;
    uint256 public totalEvents;
    uint256 public totalSupply;


    struct Events {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Events) eventList;  // All the events available
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;  // Add the owner of the seat
    mapping(uint256 => uint256[]) seatsTaken;  // Total seats taken for an event
    mapping(uint256 => mapping(address => bool)) public hasBooked; // check if the person has already booked

    constructor(
        string memory _name, 
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner{

        totalEvents++;
        eventList[totalEvents] = Events(
            totalEvents,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    function mint(
        uint256 _id, // Event id 
        uint256 _seat // Seat id for a particular event
    ) public payable {

        require(_id != 0);  // No event will have an id of 0
        require(_id <= totalEvents);  // Check if the id / event exists it will not be more than the total number of events
        require(msg.value == eventList[_id].cost); // Amount should be equal to the MRP
        require(seatTaken[_id][_seat] == address(0)); // Check if the seat is not taken
        require(_seat <= eventList[_id].maxTickets); // Check if the seat exists

        eventList[_id].tickets -= 1;  // Decrease the number of seats available for that event

        seatTaken[_id][_seat] = msg.sender;   // Assign that particular seat of an event to a person who calls the function

        hasBooked[_id][msg.sender] = true;  // To make sure that the person buys only one ticket 

        seatsTaken[_id].push(_seat);   // Push the taken seat to the seatsTaken array for a partiular event

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getSeats (
        uint256 _id
    ) public view returns (uint256[] memory){
        return seatsTaken[_id];
    }

    function getEvent(uint256 _id) public view returns(Events memory) {
        return eventList[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

} 