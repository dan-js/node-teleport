import CLI from "./CLI";

function currentFolder() {
    return process.cwd().split("/").pop();
}

const instance = new CLI("lambda-api")
    .withCommands([
        {
            name: "up",
            description: "create the AWS infrastructure",
            handler: import("../create"),
        },
        {
            name: "down",
            description: "destroy the AWS infrastructure",
            handler: import("../delete"),
        },
        {
            name: "update",
            description: "update the function code",
            handler: import("../update"),
        },
        {
            name: "state",
            description: "get the state, or an item from the state",
            handler: import("../state-command"),
        },
    ])
    .withFlags([
        {
            name: "functionName",
            description: "name prefix for AWS resources",
            commands: ["up", "down", "update"],
            long: "name",
            short: "n",
            env: "LAPI_FUNCTION_NAME",
            fallback: currentFolder,
        },
        {
            name: "region",
            description: "region for AWS resources, eg. 'eu-west-1'",
            commands: ["up", "down", "update"],
            long: "region",
            short: "r",
            env: "LAPI_AWS_REGION",
        },
        {
            type: Boolean,
            name: "shouldDeleteLogs",
            description: "delete cloudwatch logs",
            commands: ["down"],
            long: "logs",
            env: "LAPI_DELETE_LOGS",
            fallback: false,
        },
        {
            name: "updateFrom",
            description: "relative path to lambda code directory",
            commands: ["update"],
            long: "from",
            short: "f",
            env: "LAPI_LAMBDA_DIR",
            fallback: "dist/",
        },
        {
            name: "stateItem",
            description: "state item to pull",
            commands: ["state"],
            long: "item",
            short: "i",
        },
    ]);

export default instance;
