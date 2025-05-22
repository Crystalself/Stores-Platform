const router = require("express").Router();

const test = require("./test");

router.get('/test', test);

module.exports = router;