const Admin = require("../../../../Classes/Admin");

module.exports = async (req, res, next) => {
    try {
        const count = await Admin.logout(req.admin.currentSession.session_id);
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