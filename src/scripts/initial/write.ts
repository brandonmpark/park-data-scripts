import mongoose from "mongoose";
import AttractionModel from "../../models/attraction";
import WaitTimeData from "../../models/waitTimeData";
import { Attraction } from "../../types/attraction";
import * as logger from "../../utils/logger";

const write = async (data: Attraction[]) => {
    logger.log("Writing initial metadata...", { type: "b" });

    const attractionBulkWrite = data.map((attraction) => ({
        updateOne: {
            filter: { name: attraction.name, park: attraction.park },
            update: { $set: attraction },
            upsert: true,
        },
    }));
    const upsertedIds: mongoose.Types.ObjectId[] = Object.values(
        (await AttractionModel.bulkWrite(attractionBulkWrite)).upsertedIds
    );

    const waitTimeBulkWrite = upsertedIds.map((attractionId) => ({
        insertOne: {
            document: {
                attractionId,
                entries: [],
            },
        },
    }));
    await WaitTimeData.bulkWrite(waitTimeBulkWrite);

    logger.log("Initial metadata written!", { type: "b" });
};

export default write;
