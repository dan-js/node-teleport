import getGatewayResources from "./getGatewayResources";

export default async (restApiId, path) => {
    const resources = await getGatewayResources(restApiId);

    return resources.find((resource) => resource.path === path);
};
