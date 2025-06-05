const router = require("express").Router();

const authMiddleware = require("../../../Middlewares/user-auth");
const sellerMiddleware = require("../../../Middlewares/seller-auth");

const auth = require("./auth");
const product = require("./product");
const profile = require("./profile");

router.use('/auth', auth);
router.use('/product', authMiddleware , sellerMiddleware ,product);
router.use('/profile', authMiddleware ,profile);

module.exports = router;