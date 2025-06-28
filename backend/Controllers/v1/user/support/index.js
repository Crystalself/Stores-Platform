const router = require("express").Router();

const createTicket = require("./create-ticket");
const allTickets = require("./all-tickets");
const ticketDetails = require("./ticket-details");
const sendMessage = require("./send-message");
const closeTicket = require("./close-ticket");
const rateTicket = require("./rate-ticket");

router.put('/create-ticket', createTicket);
router.post('/all-tickets', allTickets);
router.post('/ticket-details', ticketDetails);
router.put('/send-message', sendMessage);
router.put('/close-ticket', closeTicket);
router.put('/rate-ticket', rateTicket);

module.exports = router; 