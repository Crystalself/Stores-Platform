const imageTypes = ['png', 'jpeg', 'jpg'];
const mimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const {object, string} = require('yup');
const User = require("../../../../Classes/User");
const {ERRORS} = require("../../../utils/enums");

const schema = object({
    profile_pic: object()
        .shape({
            name: string().test(
                "fileName",
                "${path} is not valid",
                (value) => value && imageTypes.indexOf(value.slice(((value.lastIndexOf('.') -1 ) >>> 0) + 2 )) !== -1
            ),
            mimetype: string().test(
                "fileName",
                "${path} is not valid",
                (value) => value && mimeTypes.indexOf(value) !== -1
            ),
            size: string().test(
                "size",
                "${path} size is too large",
                (value) => value && (value / (1024 * 1024)) < 5
            ),
        })
        .required(),

});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['files']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {profile_pic} = req.files;
        await User.updateProfilePic(req.user.id, profile_pic, req.user.profile_pic);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}


