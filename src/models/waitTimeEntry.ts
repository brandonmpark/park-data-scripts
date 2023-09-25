/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";
import { Status } from "../types/attraction";
import type { WaitTimeEntry } from "../types/waitTime";

export const waitTimeEntrySchema = new mongoose.Schema<WaitTimeEntry>({
    timestamp: {
        type: Date,
        required: true,
    },
    weather: {
        temperature: {
            type: Number,
            required: true,
        },
        conditions: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        required: true,
        enum: Object.keys(Status),
    },
    waitTime: {
        type: Number,
        required: true,
        min: 0,
    },
});
