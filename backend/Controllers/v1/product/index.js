const router = require("express").Router();

const all = require("./all");
const details = require("./details");
const search = require("./search");

router.post('/all', all);
router.get('/details', details);
router.post('/search', search);

module.exports = router;