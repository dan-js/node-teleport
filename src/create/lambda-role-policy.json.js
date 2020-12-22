export default {
    Version: "2012-10-17",
    Statement: [
        {
            Action: ["logs:*", "apigateway:*", "dynamodb:*", "ses:*"],
            Resource: "*",
            Effect: "Allow",
        },
    ],
};
