#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

import { createStateFileIfNeeded } from "./state";
import { createWorkDir } from "./util/fs";

import create from "./create";
import update from "./update";
import _delete from "./delete";
import state from "./state-command";

createWorkDir();
createStateFileIfNeeded();

const currentFolder = process.cwd().split("/").pop();

const addSharedFlags = (ygs) => {
    ygs.option("name", {
        alias: "n",
        description: "Name of the lambda",
        default: currentFolder,
    })
        .option("region", {
            alias: "r",
            description: "AWS region for deployment",
        })
        .demandOption(["region"]);
};

yargs(hideBin(process.argv))
    .help("h")
    .alias("h", "help")
    .command(
        "create",
        "Create the lambda AWS infrastructure",
        (ygs) => {
            addSharedFlags(ygs);
            ygs.option("language", {
                alias: "l",
                description: "Programming language, 'node' or 'go'",
                default: "node",
            });
        },
        create
    )
    .command(
        "update",
        "Update the lambda code",
        (ygs) => {
            addSharedFlags(ygs);
            ygs.option("from", {
                alias: "f",
                description: "Relative path to lambda code directory",
                default: "dist/",
            }).option("noDeps", {
                type: "boolean",
                description: "Exclude node_modules from lambda bundle",
                default: false,
            });
        },
        update
    )
    .command(
        "delete",
        "Delete the lambda AWS infrastructure",
        (ygs) => {
            addSharedFlags(ygs);
            ygs.option("deleteLogs", {
                type: "boolean",
                description: "Delete cloudwatch logs",
                default: false,
            });
        },
        _delete
    )
    .command(
        "state",
        "Get the state, or an item from the state",
        (ygs) => {
            ygs.option("item", {
                alias: "i",
                description: "state item to pull",
            });
        },
        state
    ).argv;
