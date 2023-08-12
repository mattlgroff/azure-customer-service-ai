const sgMail = require('@sendgrid/mail');

module.exports.sendEmail = async function (emailToSend) {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        await sgMail.send({
            ...emailToSend,
            from: fromEmail,
        });

        return {
            status: 200,
            message: `Email successfully sent from ${fromEmail} to ${emailToSend.to}`,
        };
    } catch (error) {
        return {
            status: 502,
            message: `Error sending email from ${fromEmail} to ${emailToSend.to}: ${error.message}`,
        };
    }
};
