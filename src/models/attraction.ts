import mongoose from "mongoose";
import type { Attraction } from "../types/attraction";

const AttractionModel =
    mongoose.connection.collection<Attraction>("attractions");

export default AttractionModel;
