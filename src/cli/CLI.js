import { stringFlag, booleanFlag } from "./flag";

const prettyFunctionName = (func) => {
    return func.name.replace(/([A-Z])/g, (char) => ` ${char.toLowerCase()}`);
};

const SPINNER_FLAG = {
    name: "spinner",
    description: "spinner type earth|moon|dots|none",
    long: "spinner",
    fallback: "earth",
};

export default class CLI {
    commands = [];
    flags = [];
    values = {};

    constructor(cliName) {
        this.cliName = cliName;
    }

    async run() {
        this.helpIfNeeded();

        const command = process.argv[2];

        const commandMapping = this.commands.reduce(
            (acc, { name, handler }) => {
                acc[name] = handler;
                return acc;
            },
            {}
        );

        let handler = commandMapping[command];

        // Support dynamic import (to help avoid cyclical deps)
        if (handler instanceof Promise) {
            handler = (await handler).default;
        }

        if (!handler) {
            process.stdout.write(this.commandHelp());
            process.exit(1);
        }

        return Promise.resolve(handler()).then(() => process.exit());
    }

    withCommands(commands = []) {
        this.commands = commands;

        return this;
    }

    withFlags(flags = []) {
        this.flags = [...flags, SPINNER_FLAG];

        this.values = this.flags.reduce(
            (
                acc,
                { name, long, env, short = "", type = String, fallback = null }
            ) => {
                let flagVal =
                    type === String
                        ? stringFlag(long, short)
                        : booleanFlag(long, short);

                if (!flagVal && env) {
                    flagVal = process.env[env];
                    // console.debug("Set flag from env", name, flagVal);
                }

                if (!flagVal && typeof fallback !== "undefined") {
                    flagVal =
                        typeof fallback === "function" ? fallback() : fallback;
                    // console.debug("Set flag from fallback", name, flagVal);
                }

                acc[name] = flagVal;

                return acc;
            },
            {}
        );

        return this;
    }

    helpIfNeeded() {
        const helpCommandIndex = process.argv.indexOf("--help");

        if (helpCommandIndex === -1) {
            return;
        }

        const commandToHelp = process.argv[helpCommandIndex - 1];

        // Check for a command to help with that name
        if (this.commands.some(({ name }) => name === commandToHelp)) {
            process.stdout.write(this.help(commandToHelp));
        } else {
            process.stdout.write(this.commandHelp());
        }

        process.exit(0);
    }

    help(commandName = null) {
        if (!commandName) {
            // Show help for commands
            return this.commandHelp();
        }

        const command = this.commands.find(({ name }) => name === commandName);

        if (!command) {
            console.log(`unknown command: ${commandName}`);
            process.exit(1);
        }

        const description = command.description
            ? "\n" + command.description
            : "";

        // Relevant flags for this command
        const commandFlags = this.flags.filter(
            ({ commands }) =>
                !Array.isArray(commands) || commands.includes(commandName)
        );

        const commandUsage = this.commandUsage(commandName, commandFlags);

        let helpStr = `${commandUsage}${description}\n\nflags:`;

        const helpFlags = commandFlags
            // Build syntax summaries first so we can pad right
            .map(({ long, short, type = String, ...rest }) => {
                let syntax = `\n  `;

                syntax += `--${long}`;

                if (short) {
                    syntax += `, -${short}`;
                }

                if (type === String) {
                    syntax += " <value>";
                }

                return {
                    syntax,
                    long,
                    short,
                    type,
                    ...rest,
                };
            });

        const longestFlagSyntax = Math.max(
            ...helpFlags.map(({ syntax }) => syntax.length)
        );

        helpFlags.forEach(({ syntax, description, fallback }) => {
            helpStr += syntax.padEnd(longestFlagSyntax, " ");

            if (description) {
                helpStr += ` - ${description}`;
            }

            if (typeof fallback !== "undefined") {
                const fallbackText =
                    typeof fallback === "function"
                        ? prettyFunctionName(fallback)
                        : fallback;
                helpStr += ` (default: ${fallbackText})`;
            }
        });

        return helpStr + "\n";
    }

    commandHelp() {
        const longestCommandLength = Math.max(
            ...this.commands.map(({ name }) => name.length)
        );

        let helpStr = `usage: ${this.cliName} <command>\n\ncommands:`;

        this.commands.forEach(({ name, description }) => {
            helpStr += `\n  ${name.padEnd(
                1 + longestCommandLength,
                " "
            )}- ${description}`;
        });

        return helpStr + "\n";
    }

    /**
     * Get a usage example string
     */
    commandUsage(commandName, flags) {
        const flagUsage = flags
            .map(({ long, short = "", type = String }) => {
                const _short = short ? ` | -${short}` : "";
                const valueString = type === String ? " <value>" : "";
                return `[--${long}${_short}${valueString}]`;
            })
            .join(" ");

        return `usage: ${commandName} ${flagUsage}`;
    }
}
