import { iam } from "../services";
import { save } from "../state";

import rolePolicy from "./lambda-role-policy.json";

export default async (policyName) => {
    const { Policy: policy } = await iam
        .createPolicy({
            PolicyName: policyName,
            PolicyDocument: JSON.stringify(rolePolicy),
        })
        .promise();

    return save({
        policyArn: policy.Arn,
    });
};
