import { gateway } from "../services";
import { save } from "../state";

export default async (apiName) => {
    const { id: apiId } = await gateway
        .createRestApi({
            name: apiName,
            binaryMediaTypes: ["*"],
        })
        .promise();

    return save({
        apiId,
    });
};
