import mongoose from "mongoose";
import { Status } from "./attraction";

export interface Weather {
    temperature: number;
    conditions: number;
}

export interface WaitTimeEntry {
    timestamp: Date;
    weather: Weather;
    status: Status;
    waitTime: number;
}

export interface LabeledWaitTimeEntry extends WaitTimeEntry {
    name: string;
}

export interface WaitTimeData {
    attractionId: mongoose.Types.ObjectId;
    entries: WaitTimeEntry[];
}

export interface RawWaitTimeEntry {
    name: string;
    status: "OPERATING" | "DOWN" | "CLOSED" | "REFURBISHMENT";
    queue?: {
        STANDBY?: {
            waitTime: number | null;
        };
    };
}

export interface RawData {
    liveData: RawWaitTimeEntry[];
}
