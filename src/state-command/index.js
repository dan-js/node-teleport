import { getState } from "../state";
import cli from "../cli/instance";

export default async () => {
    const { stateItem } = cli.values;
    const state = getState() ?? {};

    if (!stateItem) {
        process.stdout.write(`${JSON.stringify(state, null, 2)}\n`);
    } else {
        process.stdout.write(state[stateItem]);
    }

    process.exit();
};
