export const sleep = async (ms = 1000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const asyncRetry = async (times, delay, func) => {
    let i = 0;

    while (i++ < times) {
        try {
            return await func();
        } catch {
            await sleep(delay);
        }
    }

    throw new Error(`Retried ${times} times and failed :(`);
};

export const guarded = async (fn) => {
    try {
        return await Promise.resolve(fn());
        // eslint-disable-next-line no-empty
    } catch (e) {
        console.log(e);
    }
};
