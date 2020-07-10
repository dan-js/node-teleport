import { join } from "path";

import installProductionModules from "./installProductionModules";
import updateFunctionCode from "./lambda/updateFunctionCode";
import {
    copyRecursive,
    pathFromWorkDir,
    mkdirIfNotExists,
    zipFolder,
} from "../util";
import { getState, validateFunctionName } from "../state";
import withSpinner from "../cli/withSpinner";
import cli from "../cli/instance";

const zipWorkDir = pathFromWorkDir("./to-zip");

mkdirIfNotExists(zipWorkDir);

export default async () => {
    const { functionName, updateFrom } = cli.values;

    await validateFunctionName(functionName);

    const updateFromAbsolute =
        updateFrom.charAt(0) === "/"
            ? updateFrom
            : join(process.cwd(), updateFrom);

    await withSpinner(
        `Copying from ${updateFrom}`,
        () => Promise.resolve(copyRecursive(updateFromAbsolute, zipWorkDir)),
        () => `Copied from ${updateFrom}`
    );

    await withSpinner(
        "Adding production dependencies",
        () => Promise.resolve(installProductionModules(zipWorkDir)),
        () => "Installed production dependencies"
    );

    const zipPath = pathFromWorkDir("zipped.zip");

    await withSpinner(
        "Zipping lambda",
        () => zipFolder(zipWorkDir, zipPath),
        () => "Zipped lambda successfully"
    );

    await withSpinner(
        "Updating lambda",
        () => updateFunctionCode({ functionName, zipPath }),
        (result) => `Updated lambda! New code SHA: ${result.lambdaSha}`
    );

    console.log(`Endpoint: ${getState().endpoint}`);

    process.exit(0);
};
