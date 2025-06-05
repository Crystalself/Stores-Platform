const {object, string} = require('yup');
const User = require("../../../../Classes/User");
const {ERRORS} = require("../../../utils/enums");
const Helper = require("../../../utils/Helper");

const schema = object({
    profile_pic: Helper.yupImgValidation.required(),
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


