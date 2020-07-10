import { createInterface } from "readline";

const standardInterface = createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const question = async (query) =>
    new Promise((resolve) => standardInterface.question(query, resolve));

const booleanTextValues = ["y", "yes", "true"];

export const booleanQuestion = async (query) => {
    const answer = await question(`${query} [Y/n]\n`);

    return booleanTextValues.includes(answer.toLowerCase());
};
