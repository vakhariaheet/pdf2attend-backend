import { Schema, model } from "mongoose";


const TimeTableSchema = new Schema({
    subjectId: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: "Batch",
    },
    id: {
        type: String,
    },
    day: {
        type: String,
    },
    startTime: {
        type: String,
    },

});

const TimeTable = model("TimeTable", TimeTableSchema);
export default TimeTable;
