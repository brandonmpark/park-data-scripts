import mongoose from "mongoose";
import initial from "./scripts/initial/initial";
import metadata from "./scripts/metadata/metadata";
import waitTimes from "./scripts/waitTimes/waitTimes";
import * as config from "./utils/config";
import * as logger from "./utils/logger";

const args = process.argv.slice(2);

const initialFlag = args.includes("--initial");
const metadataFlag = args.includes("--metadata");
const waitTimesFlag = args.includes("--wait-times");

const startService = async () => {
    logger.log("Starting service...", { type: "h1" });
    logger.log(`Connecting to MongoDB...`, { type: "b" });

    mongoose.connect(config.MONGODB_URI).then(() => {
        logger.log("Connected to MongoDB!", { type: "b" });
    });

    if (initialFlag) {
        logger.log("Fetching initial metadata...", { type: "h1" });
        await initial.fetch();
    }

    if (metadataFlag) {
        logger.log("Fetching metadata...", { type: "h1" });
        await metadata.fetch();
    }

    if (waitTimesFlag) {
        logger.log("Polling wait times...", { type: "h1" });
        await waitTimes.poll(1000 * 60 * 5);
    }

    await mongoose.connection.close();
};

startService();
