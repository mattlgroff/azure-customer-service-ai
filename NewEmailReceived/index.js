const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = req.query.name || (req.body && req.body.name);
    const responseMessage = name
        ? 'Hello, ' + name + '. This HTTP triggered function executed successfully.'
        : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

    try {
        console.log('Sending email...', process.env.SENDGRID_API_KEY)
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: 'mattlgroff@gmail.com',
            from: 'matt@umbrage.com', // Use the email address or domain you verified above
            subject: 'We got your message! ' + JSON.stringify(new Date()),
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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
