const router = require("express").Router();

const all = require("./all");
const create = require("./create");
const details = require("./details");
const sendMessage = require("./send-message");
const markRead = require("./mark-read");

router.post('/all', all);
router.put('/create', create);
router.post('/details', details);
router.put('/send-message', sendMessage);
router.put('/mark-read', markRead);

module.exports = router; 