const router = require("express").Router();

const admin = require("./admin");
const product = require("./product");
const user = require("./user");

router.use('/admin', admin);
router.use('/product', product);
router.use('/user', user);

module.exports = router;