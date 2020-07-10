import { gateway } from "../services";
import { save } from "../state";

export default async ({ restApiId, parentId, pathPart }) => {
    const { id: resourceId } = await gateway
        .createResource({
            restApiId,
            parentId,
            pathPart,
        })
        .promise();

    return save({
        resourceId,
    });
};
