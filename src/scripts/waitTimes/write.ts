import AttractionModel from "../../models/attraction";
import WaitTimeData from "../../models/waitTimeData";
import { AttractionWithId, Park } from "../../types/attraction";
import type { LabeledWaitTimeEntry } from "../../types/waitTime";
import * as logger from "../../utils/logger";

const write = async (park: Park, waitTimeData: LabeledWaitTimeEntry[]) => {
    const attractions: AttractionWithId[] = await (
        await AttractionModel.find({
            park,
        })
    ).toArray();

    const { waitTimes, attractionsWithWaitTimes } = attractions.reduce(
        (acc, attraction) => {
            const waitTime = waitTimeData.find(
                (wt) => wt.name === attraction.name
            );
            if (waitTime) {
                acc.waitTimes.push(waitTime);
                acc.attractionsWithWaitTimes.push(attraction);
            }
            return acc;
        },
        {
            waitTimes: [] as LabeledWaitTimeEntry[],
            attractionsWithWaitTimes: [] as AttractionWithId[],
        }
    );

    const attractionBulkWrite = waitTimes.map((waitTime, i) => ({
        updateOne: {
            filter: { name: attractionsWithWaitTimes[i].name, park },
            update: {
                $set: {
                    waitTime: waitTime.waitTime,
                    status: waitTime.status,
                    waitTimeLastUpdated: waitTime.timestamp,
                },
            },
        },
    }));

    const waitTimeDataBulkWrite = waitTimes.map((waitTime, i) => ({
        updateOne: {
            filter: { attractionId: attractionsWithWaitTimes[i]._id },
            update: {
                $push: {
                    entries: {
                        timestamp: waitTime.timestamp,
                        weather: waitTime.weather,
                        status: waitTime.status,
                        waitTime: waitTime.waitTime,
                    },
                },
            },
        },
    }));

    logger.log(`Writing ${park} wait times...`, { type: "b" });
    await Promise.all([
        AttractionModel.bulkWrite(attractionBulkWrite),
        WaitTimeData.bulkWrite(waitTimeDataBulkWrite),
    ]);
    logger.log(`${park} wait times written!`, { type: "b" });
};

export default write;
