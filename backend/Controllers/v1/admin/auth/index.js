const router = require("express").Router();

const authMiddleware = require("../../../../Middlewares/admin-auth");

const login = require("./login");
const me = require("./me");
const logout = require("./logout");

router.post("/login", login)
router.get("/me", authMiddleware, me);
router.get("/logout", authMiddleware, logout);

module.exports = router;