import { gateway } from "../services";

export default async (restApiId) => {
    const { items: resources } = await gateway()
        .getResources({ restApiId })
        .promise();

    return resources;
};
