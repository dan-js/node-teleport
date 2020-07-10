import deleteRoleWithPolicy from "../delete/deleteRoleWithPolicy";
import deleteGateway from "../delete/deleteGateway";
import deleteFunction from "../delete/lambda/deleteFunction";
import withSpinner from "../cli/withSpinner";
import { sleep } from "./async";
import { getState } from "../state";

/**
 * Container for rollback functions
 */
export class RollbackStack extends Array {
    /**
     * Try and brutally rollback everything we made so far
     */
    async rollback() {
        await withSpinner(
            `Rolling back...`,
            async () => {
                await sleep(800);

                return Promise.all(
                    this.map((rollbackRunner) =>
                        Promise.resolve(rollbackRunner()).catch()
                    )
                );
            },
            () => "Rolled back successfully"
        );

        process.exit(1);
    }
}

const stack = new RollbackStack();

const mapToState = (fn, stateKeys = []) => {
    const state = getState();

    const stateValues = stateKeys.reduce((acc, key) => {
        acc[key] = state[key];
        return acc;
    }, {});

    const numValues = Object.values(stateValues).filter(Boolean);

    if (numValues < stateKeys.length) {
        return () => {};
    }

    return () => fn(stateValues);
};

export default () => {
    stack.push(
        mapToState(deleteRoleWithPolicy, ["roleName", "policyArn"]),
        mapToState(deleteGateway, ["apiId"]),
        mapToState(deleteFunction, ["functionName"])
    );

    process.env.ROLLING_BACK = true;

    stack.rollback();
};
