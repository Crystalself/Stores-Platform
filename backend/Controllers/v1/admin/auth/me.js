module.exports = async (req, res, next) => {
    try {
        const data = {id: req.admin.id, username: req.admin.username, user: req.admin.level}
        res.status(200).send({
            statusCode: 200,
            data,
            message: "Success",
        });
    } catch (e) {
        res.clearCookie("Authorization");
        res.removeHeader("Authorization");
        next(e);
    }
}