import AttractionModel from "../../models/attraction";
import { LabeledMetadata } from "../../types/attraction";
import * as logger from "../../utils/logger";
import reset from "./reset";

const write = async (metadata: LabeledMetadata[]) => {
    logger.log("Writing metadata...", { type: "b" });
    await reset();
    const bulkWrite = metadata.map((attraction) => ({
        updateOne: {
            filter: { name: attraction.name, park: attraction.park },
            update: {
                $set: attraction,
            },
        },
    }));

    await AttractionModel.bulkWrite(bulkWrite);
    logger.log("Metadata written!", { type: "b" });
};

export default write;
