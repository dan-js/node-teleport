import rollback from "./util/rollback";
import { sleep } from "./util";

export const errorHandler = async (err) => {
    if (process.env.ROLLING_BACK) {
        return;
    }

    console.log(`\nCaught Error, attempting rollback:`);
    console.error(err);
    console.log(`\n`);

    await sleep(600);

    await rollback();
};

export const registerRollback = () => {
    process.addListener("uncaughtException", errorHandler);
    process.addListener("unhandledRejection", errorHandler);
};
