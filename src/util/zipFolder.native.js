import { spawn } from "child_process";
import { existsSync, unlinkSync } from "fs";

export const zipFolder = async (folder, output) =>
    new Promise((resolve, reject) => {
        if (existsSync(output)) {
            unlinkSync(output);
        }

        const zip = spawn("zip", ["-r", "-X", "-D", output, "."], {
            env: process.env,
            cwd: folder,
            stdio: "inherit",
        });

        zip.on("exit", resolve);

        zip.on("close", resolve);

        zip.on("error", reject);
    });
