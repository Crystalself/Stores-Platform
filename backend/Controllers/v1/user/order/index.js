const router = require("express").Router();

const all = require("./all");
const details = require("./details");
const cancel = require("./cancel");

router.post('/all', all);
router.post('/details', details);
router.put('/cancel', cancel);

module.exports = router; 