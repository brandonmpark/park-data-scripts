import { Park, Status } from "../../types/attraction";
import type {
    LabeledWaitTimeEntry,
    RawData,
    WaitTimeEntry as WaitTimeEntryType,
} from "../../types/waitTime";
import { getKey } from "../../utils/cache";
import * as parser from "../../utils/parser";

const DISNEYLAND_URL =
    "https://api.themeparks.wiki/v1/entity/7340550b-c14d-4def-80bb-acdb51d49a66/live";
const CALIFORNIA_ADVENTURE_URL =
    "https://api.themeparks.wiki/v1/entity/832fcd51-ea19-4e77-85c7-75d5843b127c/live";

const getUrl = (park: Park) =>
    park === Park.DISNEYLAND ? DISNEYLAND_URL : CALIFORNIA_ADVENTURE_URL;

const parseWaitTime = (waitTime: any): WaitTimeEntryType => {
    const parsed = {
        timestamp: getKey("timestamp"),
        weather: getKey("weather"),
        status: Status.CLOSED,
        waitTime: 0,
    };

    parsed.status = parser.parseStatus(waitTime.status);

    if (waitTime?.queue?.STANDBY?.waitTime != null)
        parsed.waitTime = waitTime.queue.STANDBY.waitTime;

    return parsed;
};

const get = async (park: Park): Promise<LabeledWaitTimeEntry[]> => {
    const response = (await (
        await global.fetch(getUrl(park))
    ).json()) as RawData;

    const waitTimeData = response.liveData.map((attraction) => ({
        ...parseWaitTime(attraction),
        name: parser.parseName(attraction.name),
    }));

    return waitTimeData;
};

export default get;
