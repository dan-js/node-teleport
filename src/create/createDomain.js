import { gateway } from "../services";

export default async ({ domainName, certificateArn }) =>
    gateway.createDomainName({ domainName, certificateArn }).promise();
