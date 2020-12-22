import { iam } from "../services";

export default async (roleName, policyArn) =>
    iam()
        .attachRolePolicy({
            RoleName: roleName,
            PolicyArn: policyArn,
        })
        .promise();
