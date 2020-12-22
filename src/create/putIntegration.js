import { gateway } from "../services";

export default async ({ restApiId, resourceId, functionArn }) => {
    return gateway()
        .putIntegration({
            restApiId,
            resourceId,
            uri: `arn:aws:apigateway:eu-west-1:lambda:path//2015-03-31/functions/${functionArn}/invocations`,
            httpMethod: "ANY",
            type: "AWS_PROXY",
            integrationHttpMethod: "POST",
        })
        .promise();
};
