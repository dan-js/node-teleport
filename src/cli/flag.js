export const booleanFlag = (long, short = "") =>
    process.argv.includes(`--${long}`) || process.argv.includes(`-${short}`);

export const stringFlag = (long, short = "") => {
    let flagIdx = process.argv.indexOf(`--${long}`);

    if (flagIdx === -1 && short.length > 0) {
        flagIdx = process.argv.indexOf(`-${short}`);
    }

    if (flagIdx === -1) {
        return null;
    }

    return process.argv[flagIdx + 1] ?? null;
};
