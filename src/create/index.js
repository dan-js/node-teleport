import { registerRollback } from "../rollbackOnError";
import createRole from "./createRole";
import createPolicy from "./createPolicy";
import attachPolicy from "./attachPolicy";
import createGateway from "./createGateway";
import getGatewayResource from "../shared/getGatewayResource";
import createGatewayResource from "./createGatewayResource";
import putGatewayMethod from "./putGatewayMethod";
import createFunction from "./lambda/createFunction";
import putIntegration from "./putIntegration";
import createDeployment from "./createDeployment";
import addPermission from "./lambda/addPermission";
import { sleep, getJson } from "../util";
import { save, validateFunctionName } from "../state";
import withSpinner from "../cli/withSpinner";
import { booleanQuestion } from "../cli/input";
import cli from "../cli/instance";

export default async () => {
    registerRollback();

    const { functionName } = cli.values;

    await validateFunctionName(functionName);

    const { roleArn, roleName } = await withSpinner(
        "Creating role",
        () => createRole(`${functionName}-lambda-role`),
        (result) => `Created role ${result.roleName}! (${result.roleArn})`
    );

    const { policyArn } = await withSpinner(
        "Creating IAM policy",
        () => createPolicy(`${functionName}-lambda-policy`),
        (result) => `Created policy ${result.policyArn}!`
    );

    await withSpinner(
        "Attaching IAM policy to role",
        () => attachPolicy(roleName, policyArn),
        () => `Policy ${policyArn} attached to ${roleName}!`
    );

    const { apiId } = await withSpinner(
        "Creating API gateway",
        () => createGateway(`${functionName}-gateway`),
        (result) => `API with ID ${result.apiId} created`
    );

    const { id: rootResourceId } = await withSpinner(
        "Fetching gateway root resource",
        () => getGatewayResource(apiId, "/"),
        (result) => `Fetched root resource with ID ${result.id}`
    );

    const { resourceId: proxyResourceId } = await withSpinner(
        `Creating proxy resource`,
        () =>
            createGatewayResource({
                restApiId: apiId,
                parentId: rootResourceId,
                pathPart: "{proxy+}",
            }),
        (result) => `Created proxy resource with ID ${result.resourceId}`
    );

    await withSpinner(
        `Creating HTTP method for proxy resource`,
        () =>
            putGatewayMethod({ restApiId: apiId, resourceId: proxyResourceId }),
        () => `Added gateway ANY method for proxy resource`
    );

    if (!process.env.ROLLING_BACK) {
        throw new Error("NOPE");
    }

    await withSpinner("Waiting for a few seconds", () => sleep(3000));

    const { functionArn } = await withSpinner(
        `Creating base lambda function`,
        () =>
            createFunction({
                functionName,
                roleArn,
            }),
        (result) => `Created function with arn ${result.functionArn}`
    );

    await withSpinner(
        "Creating lambda proxy integration to link resource to lambda",
        () =>
            putIntegration({
                restApiId: apiId,
                resourceId: proxyResourceId,
                functionArn,
            }),
        () => "Created lambda proxy integration, resource linked to lambda"
    );

    await withSpinner(
        "Deploying API",
        () => createDeployment({ restApiId: apiId }),
        () => "API Deployed!"
    );

    await withSpinner(
        "Adding gateway permissions to allow triggering lambda",
        () => addPermission({ functionName }),
        () => "Added gateway permissions to allow triggering lambda"
    );

    const endpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`;

    save({ endpoint });

    console.log(`\n\nAPI Deployed! Endpoint: ${endpoint}`);

    const shouldTestRequest = await booleanQuestion(
        "Would you like to make a test request?"
    );

    if (shouldTestRequest) {
        const testEndpoint = `${endpoint}/test/endpoint?query=whatsup`;

        console.log(`API Response from ${testEndpoint}:`);

        console.log(await getJson(testEndpoint));
    }

    process.exit(0);
};
