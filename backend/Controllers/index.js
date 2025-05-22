const router = require("express").Router();
const handleError = require("./utils/handle-error");
const v1 = require("./v1")


router.use('/api/v1', v1);


router.use((req, res) => {
    res.status(404).send({
        message: "Sorry can't find that",
        statusCode: 404
    });
});

router.use((error, req, res, next) => {
    const {status, message} = handleError(error.message);
    console.error(error.message);
    if (status === 500) console.error(error);
    res.status(status).send({
        message: message,
        statusCode: status
    });
});

module.exports = router;
