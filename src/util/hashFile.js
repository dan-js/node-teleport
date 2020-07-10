import { createReadStream } from "fs";
import { createHash } from "crypto";

export const hashFile = async (path) => {
    return new Promise((resolve) => {
        const hash = createHash("sha256");

        const zipStream = createReadStream(path);

        hash.setEncoding("hex");

        zipStream.on("end", () => {
            hash.end();
            resolve(hash.read());
        });

        zipStream.pipe(hash);
    });
};
