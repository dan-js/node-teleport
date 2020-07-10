import { cwlogs } from "../services";

export default async (functionName) => {
    const logGroupName = `/aws/lambda/${functionName}`;

    await cwlogs.deleteLogGroup({ logGroupName }).promise();

    return { logGroupName };
};
