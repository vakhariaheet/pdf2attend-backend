import { Schema, model } from "mongoose";


const LectureSchema = new Schema({
    isCancel: {
        type: Boolean,
        default: false,
    },
    jobId: {
        type: String,
        default: null,
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: "Batch",
        required: true,
    },
    type: {
        enum: [ "extra", "regular" ],
        type: String,
    },
    status: {
        enum: [ "pending", "completed", "processing" ], 
        type: String,  
        default: "pending",
    },
    date: {
        type: Date,
        required: true,
    },
    timetableId: {
        type: Schema.Types.ObjectId,
        ref: "TimeTable",
        default: null,
    },
    timing: {
        type: String,
        required: true,
    }
    
}, { timestamps: true });

const Lecture = model("Lecture", LectureSchema);

export default Lecture;
