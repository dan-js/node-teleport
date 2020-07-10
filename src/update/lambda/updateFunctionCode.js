import { readFileSync } from "fs";

import { lambda } from "../../services";
import { save } from "../../state";

export default async ({ functionName, zipPath }) => {
    const { CodeSha256: lambdaSha } = await lambda
        .updateFunctionCode({
            FunctionName: functionName,
            ZipFile: readFileSync(zipPath),
        })
        .promise();

    return save({ lambdaSha });
};
