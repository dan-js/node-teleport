import { startSpinner } from "../cli/spinner";

export default async (message, fn, getDoneMessage) => {
    const spinner = startSpinner(message);

    return Promise.resolve(fn()).then((result) => {
        const doneMessage = getDoneMessage ? getDoneMessage(result) : message;
        spinner.stop(doneMessage);

        return result;
    });
};
