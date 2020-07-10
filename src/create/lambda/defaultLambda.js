import { createWriteStream, readFileSync, existsSync } from "fs";

import { pathFromWorkDir } from "../../util";

const archiver = require("archiver");

const CODE = `
    exports.handler = async (event) => ({ 
        "statusCode": 200,
        "body": JSON.stringify({ 
            greeting: '🐧 Hellooo there 👋',
            'event.path': event.path,
            'event.httpMethod': event.httpMethod,
            'event.queryStringParameters': event.queryStringParameters,
            'event.headers.Host': event.headers.Host,
        }, null, 2),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
    });
`;

const defaultLambdaZip = pathFromWorkDir("default-lambda.zip");

export default async () => {
    return new Promise((resolve) => {
        if (existsSync(defaultLambdaZip)) {
            return resolve(readFileSync(defaultLambdaZip));
        }

        const archive = archiver("zip", {
            zlib: { level: 9 },
        });

        const stream = createWriteStream(defaultLambdaZip);

        stream.on("close", () => {
            resolve(readFileSync(defaultLambdaZip));
        });

        archive.pipe(stream);

        archive.append(CODE, { name: "index.js" });

        archive.finalize();
    });
};
