const https = require('https');

exports.handler = async (event) => {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    const snsMessage = event.Records[0].Sns.Message;

    const discordMessage = {
        content: `📢 **Weiting's CloudWatch Alarm Triggered** 📢\n\`\`\`\n **${snsMessage}**\n\`\`\``
    };

    const url = new URL(discordWebhookUrl);

    const postData = JSON.stringify(discordMessage);

    const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 204) {
                    console.log('Message sent to Discord successfully.');
                    resolve({
                        statusCode: 200,
                        body: 'Notification sent to Discord successfully!'
                    });
                } else {
                    console.error(`Failed to send message to Discord. Status Code: ${res.statusCode}`);
                    console.error(`Response Body: ${responseBody}`);
                    reject(new Error(`Failed to send message to Discord. Status Code: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request error: ${e.message}`);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
};

