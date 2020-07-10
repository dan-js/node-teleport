import defaultLambda from "./defaultLambda";
import { lambda } from "../../services";
import { save } from "../../state";
import { asyncRetry } from "../../util";

export default async ({ functionName, roleArn }) => {
    const zip = await defaultLambda();

    return asyncRetry(5, 2000, async () => {
        const { FunctionArn: functionArn } = await lambda
            .createFunction({
                Code: {
                    ZipFile: zip,
                },
                FunctionName: functionName,
                Role: roleArn,
                Handler: "index.handler",
                Runtime: "nodejs12.x",
                MemorySize: 128,
                Timeout: 5,
            })
            .promise();

        return save({
            functionName,
            functionArn,
        });
    });
};
