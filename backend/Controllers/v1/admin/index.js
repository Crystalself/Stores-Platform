const router = require("express").Router();

const adminAuth = require("../../../Middlewares/admin-auth");

const auth = require("./auth");
const support = require("./support");
const order = require("./order");

router.use('/auth', auth);
router.use('/support', adminAuth, support);
router.use('/order', adminAuth, order);

module.exports = router;