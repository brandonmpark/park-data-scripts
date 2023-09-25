/* eslint-disable no-await-in-loop */
import cache from "../../utils/cache";
import fetch from "./fetch";

const poll = async (interval: number) => {
    const earliestTime = cache.get("earliestTime");
    const latestTime = cache.get("latestTime");

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const date = new Date();
        const time = date.getHours() + date.getMinutes() / 60;
        if (time < 1 || time > latestTime) process.exit(0);
        if (time > earliestTime && time < latestTime) await fetch();

        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise((r) => setTimeout(r, interval));
    }
};

export default poll;
