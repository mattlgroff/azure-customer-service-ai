const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        console.log('Sending email...', process.env.SENDGRID_API_KEY)
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: 'mattlgroff@gmail.com',
            from: 'noreply@groff.dev', // Use the email address or domain you verified above
            subject: 'We got your message!',
            text: JSON.stringify(req.body),
            html: `<strong>${JSON.stringify(req.body)}</strong>`,
        };

        await sgMail.send(msg);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: 'Email sent!',
        }

    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body);
        }

        context.res = {
            status: 500,
            body: 'Error sending email',
        }
    }

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage,
    // };
};
