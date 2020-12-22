import { gateway } from "../services";

export default async ({ apiId }) =>
    gateway().deleteRestApi({ restApiId: apiId }).promise();
