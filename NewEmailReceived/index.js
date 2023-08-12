const { craftAIEmailResponse } = require('./craft_ai_email_response');
const { sendEmail } = require('./send_email');
const { validateEmailRequest } = require('./validate_email');

module.exports = async function (context, req) {
    try {
        // Validate the request
        const validationResult = validateEmailRequest(req);
        if (!validationResult.valid) {
            context.res = {
                status: validationResult.status,
                body: validationResult.message,
            };
            return;
        }

        // Extract the email from the request after validation
        const emailFromRequest = {
            from: req.body.from,
            subject: req.body.subject,
            body: req.body.body,
        };

        // Have OpenAI Craft the email response, and send it using Function Calling
        const sendResult = await craftAIEmailResponse(emailFromRequest);

        // Return the result to the Azure Function Request to let it know if it was successful
        context.res = {
            status: sendResult.status,
            body: sendResult.message,
        };
        return;
    } catch (error) {
        // Return the error to the Azure Function Request to let it know it was NOT successful
        context.res = {
            status: 500,
            body: error.message,
        };
        return;
    }
};
