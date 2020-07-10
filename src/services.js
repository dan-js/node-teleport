import cli from "./cli/instance";

const AWS = require("aws-sdk");

const awsConfig = {
    region: cli.values.region,
};

export const iam = new AWS.IAM(awsConfig);

export const gateway = new AWS.APIGateway(awsConfig);

export const lambda = new AWS.Lambda(awsConfig);

export const cwlogs = new AWS.CloudWatchLogs(awsConfig);
