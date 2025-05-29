const router = require("express").Router();

const changePassword = require('./change-password')
const edit = require('./edit')

router.put('/change-password', changePassword)
router.put('/edit', edit)

module.exports = router;