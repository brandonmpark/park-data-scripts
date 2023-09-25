import cache from "../../utils/cache";
import get from "./get";
import write from "./write";

const fetch = async () => {
    const data = await get();

    const earliest = data.reduce((min, curr) => {
        if (!curr.todaysHours || curr.todaysHours.length === 0) return min;

        return curr.todaysHours[0] < min ? curr.todaysHours[0] : min;
    }, 24);

    const latest = data.reduce((max, curr) => {
        if (!curr.todaysHours || curr.todaysHours.length === 0) return max;

        return curr.todaysHours[curr.todaysHours.length - 1] > max
            ? curr.todaysHours[curr.todaysHours.length - 1]
            : max;
    }, 0);

    cache.set("earliestTime", earliest);
    cache.set("latestTime", latest);

    await write(data);
};

export default fetch;
