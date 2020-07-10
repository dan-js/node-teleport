import { existsSync } from "fs";
import {
    updateJsonFile,
    readJsonSync,
    writeJsonSync,
    pathFromWorkDir,
} from "./util";
import { booleanQuestion } from "./cli/input";

const stateFile = pathFromWorkDir(".nla-state.json");

if (!existsSync(stateFile)) {
    writeJsonSync(stateFile, {});
}

export const getState = () => readJsonSync(stateFile);

export const updateState = (cb) => updateJsonFile(stateFile, cb);

export const save = (data) => {
    updateState((state) => ({ ...state, ...data }));

    return data;
};

/**
 * Check if the function name matches the one in state
 */
export const validateFunctionName = async (functionName) => {
    const { functionName: stateFunctionName } = getState();

    if (stateFunctionName && functionName !== stateFunctionName) {
        const force = await booleanQuestion(
            "WARNING: It looks like you're trying to create AWS resources with an infrastructure " +
                "name different to the one found in the state\n" +
                'You may want to run the "down" command with the old name to remove the old infrastructure first; that state may ' +
                "be overwritten if you continue, so you will have to remove resources manually\n\n" +
                `Name in state: ${stateFunctionName}\n` +
                `Provided name: ${functionName}\n\n` +
                "Do you want to forcefully continue?"
        );

        if (!force) {
            process.exit(1);
        }
    }
};
