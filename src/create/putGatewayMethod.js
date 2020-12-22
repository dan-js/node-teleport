import { gateway } from "../services";

export default async ({ restApiId, resourceId }) =>
    gateway()
        .putMethod({
            restApiId,
            resourceId,
            authorizationType: "NONE",
            httpMethod: "ANY",
        })
        .promise();
