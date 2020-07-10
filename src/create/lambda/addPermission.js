import { lambda } from "../../services";

export default async ({ functionName }) =>
    lambda
        .addPermission({
            FunctionName: functionName,
            Action: "lambda:InvokeFunction",
            StatementId: "apigateway",
            Principal: "apigateway.amazonaws.com",
        })
        .promise();
