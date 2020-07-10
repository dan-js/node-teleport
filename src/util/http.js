import { get } from "https";

export const getJson = async (url) => {
    return new Promise((resolve) => {
        get(url, (res) => {
            let chunks = "";

            res.on("data", (chunk) => (chunks += chunk));

            res.on("end", () => resolve(JSON.parse(chunks)));
        });
    });
};
