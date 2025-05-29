const router = require("express").Router();

const authMiddleware = require("../../../../Middlewares/user-auth");

const google = require("./google");
const checkOTP = require("./check-otp");
const forgotPassword = require("./forgot-password");
const login = require("./login");
const logout = require("./logout");
const me = require("./me");
const register = require("./register");
const updatePassword = require("./update-password");

router.use('/google', google);
router.post('/check-otp', checkOTP);
router.post('/forgot-password', forgotPassword);
router.post("/login", login)
router.get("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, me);
router.post('/register', register);
router.post('/update-password', updatePassword);

module.exports = router;