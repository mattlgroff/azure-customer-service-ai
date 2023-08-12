module.exports.validateEmailRequest = function (req) {
    if (!req.body.from) {
        return {
            valid: false,
            status: 400,
            message: 'Please pass a "from" email address in the request body',
        };
    }
    if (!req.body.subject) {
        return {
            valid: false,
            status: 400,
            message: 'Please pass a "subject" in the request body',
        };
    }
    if (!req.body.body) {
        return {
            valid: false,
            status: 400,
            message: 'Please pass a "body" in the request body',
        };
    }
    return { valid: true };
};
