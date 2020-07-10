import {
    readFileSync,
    writeFileSync,
    mkdirSync,
    existsSync,
    readdirSync,
    copyFileSync,
    statSync,
} from "fs";
import { join } from "path";

export const readJsonSync = (path, fallback) =>
    JSON.parse(readFileSync(path).toString() ?? fallback);

export const writeJsonSync = (path, data) =>
    writeFileSync(path, JSON.stringify(data));

export const updateJsonFile = (path, cb) => {
    const newContents = cb(readJsonSync(path, {}));

    writeJsonSync(path, newContents);
};

export const mkdirIfNotExists = (path) =>
    existsSync(path) ? null : mkdirSync(path);

export const pathFromWorkDir = (...paths) =>
    join(process.cwd(), ".lambda-api", ...paths);

export const createWorkDir = () => {
    mkdirIfNotExists(pathFromWorkDir());
};

export const copyRecursive = (src, target) => {
    const stats = statSync(src);

    if (stats.isFile()) {
        return copyFileSync(src, target);
    }

    if (stats.isDirectory()) {
        mkdirIfNotExists(target);

        return readdirSync(src).forEach((file) => {
            const fullFilePath = `${src}/${file}`;
            const fullTargetPath = `${target}/${file}`;

            return copyRecursive(fullFilePath, fullTargetPath);
        });
    }
};
