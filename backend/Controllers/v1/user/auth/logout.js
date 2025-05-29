const User = require("../../../../Classes/User");

module.exports = async (req, res, next) => {
    try {
        const count = await User.logout(req.user.currentSession.session_id);
        res.clearCookie("Authorization");
        res.removeHeader("Authorization");
        res.send({
            statusCode: 200,
            count,
            message: "Success",
        });
    } catch (error) {
        next(error);
    }
};