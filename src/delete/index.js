const rmrfSync = require("rimraf").sync;

import deleteRoleWithPolicy from "./deleteRoleWithPolicy";
import deleteGateway from "./deleteGateway";
import deleteLogs from "./deleteLogs";
import deleteFunction from "./lambda/deleteFunction";
import { getState, validateFunctionName } from "../state";
import { guarded, pathFromWorkDir } from "../util";
import withSpinner from "../cli/withSpinner";
import cli from "../cli/instance";

export default async () => {
    const { functionName, shouldDeleteLogs } = cli.values;

    await validateFunctionName(functionName);

    const { roleName, policyArn, apiId } = getState();

    await withSpinner(
        "Deleting IAM role / policy",
        () => guarded(() => deleteRoleWithPolicy({ roleName, policyArn })),
        () => `Deleted role ${roleName} and policy ${policyArn}`
    );

    await withSpinner(
        "Deleting API",
        () => guarded(() => deleteGateway({ apiId })),
        () => `Deleted API with ID ${apiId}`
    );

    await withSpinner(
        "Deleting lambda function",
        () => guarded(() => deleteFunction({ functionName })),
        () => `Deleted function ${functionName}`
    );

    if (shouldDeleteLogs) {
        await withSpinner(
            "Deleting CloudWatch logs, --logs flag passed",
            () => guarded(() => deleteLogs(functionName)),
            ({ logGroupName }) =>
                `Deleted log group ${logGroupName}, --logs flag passed`
        );
    }

    rmrfSync(pathFromWorkDir());

    process.exit(0);
};
