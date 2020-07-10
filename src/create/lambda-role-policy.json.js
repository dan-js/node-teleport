export default {
    Version: "2012-10-17",
    Statement: [
        {
            Action: ["logs:*", "apigateway:*"],
            Resource: "*",
            Effect: "Allow",
        },
    ],
};
