import { lambda } from "../../services";

export default async ({ functionName }) =>
    lambda().deleteFunction({ FunctionName: functionName }).promise();
