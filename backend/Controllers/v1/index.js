const router = require("express").Router();

const admin = require("./admin");
const product = require("./product");
const user = require("./user");
const chatbot = require("./chatbot");

router.use('/admin', admin);
router.use('/product', product);
router.use('/user', user);
router.use('/chatbot', chatbot);

module.exports = router;