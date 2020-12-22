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
import { setRegion } from "../services";
import withSpinner from "../cli/withSpinner";

// :(
const emptyPromise = () => Promise.resolve();

const zipWorkDir = pathFromWorkDir("./to-zip");

const createWorkDir = () => {
    mkdirIfNotExists(zipWorkDir);
};

export default async ({
    name: functionName,
    from: updateFrom,
    noDeps,
    region,
}) => {
    setRegion(region);

    await validateFunctionName(functionName);

    createWorkDir();

    const updateFromAbsolute =
        updateFrom.charAt(0) === "/"
            ? updateFrom
            : join(process.cwd(), updateFrom);

    await withSpinner(
        `Copying from ${updateFrom}`,
        () => Promise.resolve(copyRecursive(updateFromAbsolute, zipWorkDir)),
        () => `Copied from ${updateFrom}`
    );

    if (noDeps) {
        await withSpinner(
            "Skipped bundling of production dependencies",
            emptyPromise
        );
    } else {
        await withSpinner(
            "Adding production dependencies",
            () => Promise.resolve(installProductionModules(zipWorkDir)),
            () => "Installed production dependencies"
        );
    }

    const zipPath = pathFromWorkDir("zipped.zip");

    await withSpinner(
        "Zipping lambda",
        () => zipFolder(zipWorkDir, zipPath),
        () => "Zipped lambda successfully"
    );

    await withSpinner(
        "Updating lambda",
        () =>
            updateFunctionCode({ functionName, zipPath }).catch(console.error),
        (result) => `Updated lambda! New code SHA: ${result.lambdaSha}`
    );

    console.log(`Endpoint: ${getState().endpoint}`);

    process.exit(0);
};
