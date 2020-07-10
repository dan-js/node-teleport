import { existsSync, unlinkSync, createWriteStream } from "fs";
const archiver = require("archiver");

export const archiveFolder = async (type, folder, output) =>
    new Promise((resolve, reject) => {
        if (existsSync(output)) {
            unlinkSync(output);
        }

        const archive = archiver(type, {
            ...(type === "zip" && {
                zlib: { level: 9 },
            }),
            ...(type === "tar" && {
                gzip: true,
            }),
        });

        const stream = createWriteStream(output);

        stream.on("close", () => {
            resolve();
        });

        stream.on("error", reject);

        archive.pipe(stream);

        archive.directory(folder, false);

        archive.finalize();
    });

export const zipFolder = (folder, output) =>
    archiveFolder("zip", folder, output);

export const tarFolder = (folder, output) =>
    archiveFolder("tar", folder, output);
