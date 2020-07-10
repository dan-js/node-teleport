import { iam } from "../services";
import { guarded } from "../util";

export default async ({ roleName: RoleName, policyArn: PolicyArn }) => {
    await guarded(() =>
        iam.detachRolePolicy({ RoleName, PolicyArn }).promise()
    );

    await guarded(() => iam.deletePolicy({ PolicyArn }).promise());

    await guarded(() => iam.deleteRole({ RoleName }).promise());
};
