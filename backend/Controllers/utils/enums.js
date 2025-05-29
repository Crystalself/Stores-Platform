const OPERATION_NAME = {
    FORGOT_PASSWORD: "FORGOT_PASSWORD",
}
const OPERATION_STATUS = {
    OTP_SENT:"OTP_SENT",
    OTP_CORRECT:"OTP_CORRECT"
}
const SUPPORT_TICKET_STATUS = {}
const ORDER_STATUS = {}
const CATEGORY = {}
const ERROR_MESSAGES = {
    VALIDATION_ERROR: {status: 422, message: "Validation Error"},
    USERNAME_PASSWORD_INCORRECT: {status: 400, message: 'Please check your credentials!'},
    EMAIL_PASSWORD_INCORRECT: {status: 400, message: 'Please check your credentials!'},
    UNAUTHORIZED: {status: 401, message: "UNAUTHORIZED"},
    ADMIN_RESTRICTED: {status: 401, message: "ADMIN_RESTRICTED"},
    USER_RESTRICTED: {status: 401, message: "USER_RESTRICTED"},
    USER_ALREADY_EXISTS: {status: 409, message: "USER_ALREADY_EXISTS"},
    OPERATION_IN_PROGRESS: {status: 409, message: "OPERATION_IN_PROGRESS"},
    OTP_EXPIRED: {status: 409, message: "OTP_EXPIRED"},
    EMAIL_NOT_SENT: {status: 409, message: "EMAIL_NOT_SENT"},
    WRONG_OTP: {status: 409, message: "WRONG_OTP"},
}


const ERRORS = {}
Object.keys(ERROR_MESSAGES).forEach(key => {
    ERRORS[key] = key;
});

module.exports = {OPERATION_NAME, OPERATION_STATUS, SUPPORT_TICKET_STATUS, ORDER_STATUS, CATEGORY, ERROR_MESSAGES, ERRORS};