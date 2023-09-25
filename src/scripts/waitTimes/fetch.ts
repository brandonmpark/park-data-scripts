import { Park } from "../../types/attraction";
import { setKey } from "../../utils/cache";
import * as logger from "../../utils/logger";
import * as weather from "../../utils/weather";
import get from "./get";
import write from "./write";

const fetchPark = async (park: Park) => {
    const waitTimeData = await get(park);
    await write(park, waitTimeData);
};

const fetch = async () => {
    logger.log("Fetching wait times...", { type: "h1" });
    setKey("timestamp", new Date());
    setKey("weather", await weather.get());
    await Promise.all([
        fetchPark(Park.DISNEYLAND),
        fetchPark(Park.CALIFORNIA_ADVENTURE),
    ]);
};

export default fetch;
