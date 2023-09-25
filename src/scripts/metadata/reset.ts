import AttractionModel from "../../models/attraction";

const reset = async () => {
    await AttractionModel.updateMany(
        {},
        { $set: { todaysHours: [], todaysTimes: [] } }
    );
};

export default reset;
