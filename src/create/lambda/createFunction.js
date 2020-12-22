import defaultLambda from "./defaultLambda";
import { lambda } from "../../services";
import { save } from "../../state";
import { asyncRetry } from "../../util";

const RUNTIME_MAP = {
    node: {
        Handler: "index.handler",
        Runtime: "nodejs12.x",
    },
    go: {
        Handler: "main",
        Runtime: "go1.x",
    },
};

export default async ({ functionName, roleArn }, runtime = "node") => {
    const zip = await defaultLambda();

    const runtimeConfig = RUNTIME_MAP[runtime];

    if (!runtimeConfig) {
        throw new Error('"Runtime" arg must be node or go');
    }

    return asyncRetry(5, 2000, async () => {
        const { FunctionArn: functionArn } = await lambda()
            .createFunction({
                Code: {
                    ZipFile: zip,
                },
                FunctionName: functionName,
                Role: roleArn,
                MemorySize: 128,
                Timeout: 5,
                ...runtimeConfig,
            })
            .promise();

        return save({
            functionName,
            functionArn,
        });
    });
};
