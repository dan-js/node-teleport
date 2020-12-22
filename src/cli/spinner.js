/**
 * @see ./cli-spinners.json.js
 */
const spinners = {
    earth: {
        interval: 180,
        frames: ["🌍 ", "🌎 ", "🌏 "],
    },
    moon: {
        interval: 80,
        frames: ["🌑 ", "🌒 ", "🌓 ", "🌔 ", "🌕 ", "🌖 ", "🌗 ", "🌘 "],
    },
    dots: {
        interval: 80,
        frames: ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"],
    },
    none: {},
};

// TODO
const { frames, interval } = spinners.earth;

const CLEAR_LINE = "\r\x1b[K";

const clearLineAndWrite = (text) => {
    process.stdout.write(CLEAR_LINE);
    process.stdout.write(text);
};

let iteration = 0;
const defaultMessage = "Loading...";

export const startSpinnerBasic = (message = defaultMessage) => {
    process.stdout.write(`${message}\n`);

    return {
        stop: (doneMessage = "Done!") => {
            process.stdout.write(`${doneMessage}\n`);
        },
    };
};

export const startSpinnerFancy = (message = defaultMessage) => {
    let timeout = null;

    const spin = () => {
        iteration =
            iteration > 0 && iteration === frames.length - 1
                ? 0
                : iteration + 1;

        clearLineAndWrite(`${frames[iteration]} ${message}`);

        // Recurse
        timeout = setTimeout(spin, interval);
    };

    spin();

    const handleFailure = () => {
        clearTimeout(timeout);

        process.removeListener("unhandledRejection", handleFailure);
        process.removeListener("uncaughtException", handleFailure);
    };

    process.addListener("unhandledRejection", handleFailure);
    process.addListener("uncaughtException", handleFailure);

    const stop = (doneMessage = "") => {
        clearTimeout(timeout);
        clearLineAndWrite(`✅ ${doneMessage || message}\n`);

        process.removeListener("unhandledRejection", handleFailure);
        process.removeListener("uncaughtException", handleFailure);
    };

    return {
        stop,
    };
};

export const startSpinner = ((spinnerDisabled) => {
    return spinnerDisabled ? startSpinnerBasic : startSpinnerFancy;
})(!frames || !interval);
