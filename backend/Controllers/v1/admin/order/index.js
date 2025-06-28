const router = require("express").Router();

const all = require("./all");
const updateStatus = require("./update-status");
const markPaid = require("./mark-paid");
const markDelivered = require("./mark-delivered");

router.post('/all', all);
router.put('/update-status', updateStatus);
router.put('/mark-paid', markPaid);
router.put('/mark-delivered', markDelivered);

module.exports = router; 