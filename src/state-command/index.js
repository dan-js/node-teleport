import { getState } from "../state";

export default async ({ item }) => {
    const state = getState() ?? {};

    if (!item) {
        process.stdout.write(`${JSON.stringify(state, null, 2)}\n`);
    } else {
        process.stdout.write(`${state[item]}\n`);
    }

    process.exit();
};
