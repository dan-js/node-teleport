import { iam } from "../services";
import { save } from "../state";

import trustPolicy from "./lambda-role-trust-policy.json";

export default async (roleName) => {
    const { Role: role } = await iam
        .createRole({
            RoleName: roleName,
            AssumeRolePolicyDocument: JSON.stringify(trustPolicy),
        })
        .promise();

    return save({
        roleArn: role.Arn,
        roleId: role.RoleId,
        roleName: role.RoleName,
    });
};
