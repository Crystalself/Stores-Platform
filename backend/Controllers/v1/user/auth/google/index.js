const router = require("express").Router();

const login = require("./login");
const register = require("./register");

router.post("/login", login)
router.post("/register", register)

module.exports = router;