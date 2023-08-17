const { Configuration, OpenAIApi, ChatCompletionResponseMessageRoleEnum } = require('openai-edge');
const { sendEmail } = require('./send_email');
const { getEmailHistory } = require('./get_email_history');
const { getRelatedFAQs } = require('./get_related_faqs');

module.exports.craftAIEmailResponse = async function (emailFromRequest) {
    console.log('emailFromRequest', emailFromRequest);

    try {
        const configuration = new Configuration({
            apiKey: process.env.AZURE_OPENAI_KEY, // Key 1 or Key 2 from Azure OpenAI Resource
            basePath: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`, // Endpoint from Azure OpenAI Resource + /openai/deployments/ + Deployment Name from Azure OpenAI
            defaultQueryParams: new URLSearchParams({
              "api-version": process.env.AZURE_OPENAI_API_VERSION ? process.env.AZURE_OPENAI_API_VERSION : '2023-08-01-preview', // Find version numbers here: https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference
            }),
            baseOptions: {
                headers: {
                    'api-key': process.env.AZURE_OPENAI_KEY, // Key 1 or Key 2 from Azure OpenAI Resource (Again! Same one from apiKey above)
                },
            },
        });

        const openai = new OpenAIApi(configuration);

        const emailHistoryContext = await getEmailHistory(emailFromRequest.from);
        const faqContext = await getRelatedFAQs(emailFromRequest.subject, emailFromRequest.body);

        const messages = [
            {
                role: 'system',
                content: process.env.SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: `
                  Recent Email History With This Customer: ${emailHistoryContext}\n

                  Top Related Frequently Asked Questions: ${faqContext}\n

                  Customer Email Address: ${emailFromRequest.from}\n

                  Customer Email Subject: ${emailFromRequest.subject}\n

                  Customer Email Body: ${emailFromRequest.body}`,
            },
        ];

        const functions = {
            sendEmail,
        };

        const response = await openai.createChatCompletion({
            model: process.env.AZURE_OPENAI_MODEL,
            messages,
            functions: [
                {
                    name: 'sendEmail',
                    description:
                        'Send an email with sendgrid. Text content newlines should be represented as \\n within the string for JSON parsing.',
                    parameters: {
                        type: 'object',
                        properties: {
                            to: {
                                type: 'string',
                                description: 'Recipient email address',
                            },
                            subject: {
                                type: 'string',
                                description: 'Email subject',
                            },
                            text: {
                                type: 'string',
                                description:
                                    'Raw text of the email. Newlines should be represented as \\n within the string for JSON parsing.',
                            },
                        },
                        required: ['to', 'subject', 'text'],
                    },
                },
            ],
            temperature: process.env.AZURE_OPENAI_MODEL_TEMPERATURE ? parseFloat(process.env.AZURE_OPENAI_MODEL_TEMPERATURE) : 0,
        });

        const data = await response.json();

        if (!data?.choices[0].message?.function_call?.name || !data.choices[0].message?.function_call?.arguments) {
            throw new Error('No function call found in response');
        }

        const fnName = data.choices[0].message.function_call.name;
        const args = data.choices[0].message.function_call.arguments;

        console.log('function name', fnName);
        console.log('function args', args);

        // We call the sendEmail function, but we don't actually respond to OpenAI with the result. Not necessary here.
        const functionToCall = functions[fnName];
        const functionCallResult = await functionToCall(JSON.parse(args));

        return {
            status: functionCallResult?.status,
            message: functionCallResult?.message,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: error.message,
        };
    }
};
