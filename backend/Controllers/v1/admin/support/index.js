const router = require("express").Router();

const allTickets = require("./all-tickets");
const ticketDetails = require("./ticket-details");
const sendMessage = require("./send-message");
const updateStatus = require("./update-status");

router.post('/all-tickets', allTickets);
router.post('/ticket-details', ticketDetails);
router.put('/send-message', sendMessage);
router.put('/update-status', updateStatus);

module.exports = router; 