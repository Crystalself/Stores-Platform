const router = require("express").Router();

const authMiddleware = require("../../../Middlewares/user-auth");

const auth = require("./auth");
const profile = require("./profile");

router.use('/auth', auth);
router.use('/profile', authMiddleware ,profile);

module.exports = router;