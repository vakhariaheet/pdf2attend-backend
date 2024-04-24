import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema({
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    },
    isPresent: {
        type: Boolean,
        default: false,
    },
    isProxy: {
        type: Boolean,
        default: false,
    },
    remark: {
        type: String,
        default:null
    },
}, { timestamps: true });

const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;