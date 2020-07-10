import { gateway } from "../services";

export default async ({ restApiId, stage = "dev" }) => {
    const { apiSummary } = await gateway
        .createDeployment({ restApiId, stageName: stage })
        .promise();

    return apiSummary;
};
