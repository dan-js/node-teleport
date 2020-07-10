#!/usr/bin/env node
import { createWorkDir } from "./util/fs";
import cli from "./cli/instance";

createWorkDir();

cli.run();
