module.exports = async (req, res, next) => {
    try {
        const data = {message: 'test'};

        res.status(200).send({
            statusCode: 200,
            data,
            message: 'success',
        });
    } catch(e) {
        next(e);
    }
}