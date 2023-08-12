const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        console.log('Sending email...', process.env.SENDGRID_API_KEY);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Convert buffer to string and parse as JSON
        const parsedBody = JSON.parse(req.body.toString());

        // Assuming SendGrid sends an array, we'll get the first email event object
        const emailEvent = parsedBody[0];

        const fromEmail = emailEvent.from.match(/<(.+?)>/)[1]; // Extract email address from string
        const subject = emailEvent.subject;
        const body = emailEvent.text;

        const msg = {
            to: fromEmail,
            from: 'noreply@groff.dev', // Use the email address or domain you verified above
            subject: 'Your customer service request has been processed!',
            text: `From: ${fromEmail}\nSubject: ${subject}\nBody: ${body}`,
            html: `<strong>From:</strong> ${fromEmail}<br><strong>Subject:</strong> ${subject}<br><strong>Body:</strong> ${body}`,
        };

        await sgMail.send(msg);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: 'Email sent!',
        };
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }

        context.res = {
            status: 500,
            body: 'Error sending email',
        };
    }
};
