const router = require("express").Router();

const add = require("./add");
const all = require("./all");
const allUnlisted = require("./all-unlisted");
const edit = require("./edit");
const enlist = require("./enlist");
const search = require("./search");
const unlist = require("./unlist");

router.put('/add', add);
router.post('/all', all);
router.post('/all-unlisted', allUnlisted);
router.put('/edit', edit);
router.put('/enlist', enlist);
router.post('/search', search);
router.put('/unlist', unlist);

module.exports = router;