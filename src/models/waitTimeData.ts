/* eslint-disable no-param-reassign */
import mongoose from "mongoose";
import type { WaitTimeData } from "../types/waitTime";
import { waitTimeEntrySchema } from "./waitTimeEntry";

const waitTimeDataSchema = new mongoose.Schema<WaitTimeData>({
    attractionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "attractions",
        required: true,
    },
    entries: {
        type: [waitTimeEntrySchema],
        required: true,
    },
});

waitTimeDataSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();

        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model<WaitTimeData>("WaitTimeData", waitTimeDataSchema);
