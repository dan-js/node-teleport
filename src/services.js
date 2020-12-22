const AWS = require("aws-sdk");

AWS.APIGateway;

const serviceNames = ["IAM", "APIGateway", "Lambda", "CloudWatchLogs"];

const createService = (name) => new AWS[name]();

const createServices = () =>
    serviceNames.reduce(
        (acc, name) => ({ ...acc, [name]: createService(name) }),
        {}
    );

const services = createServices();

export const setRegion = (region) => {
    AWS.config.update({ region });
    Object.assign(services, createServices());
};

export const iam = () => services["IAM"];

export const gateway = () => services["APIGateway"];

export const lambda = () => services["Lambda"];

export const cwlogs = () => services["CloudWatchLogs"];
