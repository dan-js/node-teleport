import { spawnSync } from "child_process";

export default (zipWorkDir) => {
    spawnSync(
        "yarn",
        [
            "install",
            "--modules-folder",
            `${zipWorkDir}/node_modules`,
            "--production",
            "--force",
        ],
        { cwd: process.cwd() }
    );
};
