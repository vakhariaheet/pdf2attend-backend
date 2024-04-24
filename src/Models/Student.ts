import { Schema, model } from "mongoose";

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    enrollmentNo: {
        type: Number,
        required: true,
    },
    course: {
        type: String,
    },
    rollNo: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    semester: {
        type: Number,
    },
    academicYear: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
    courseId: {
      type:Number,
    }
}, { timestamps: true });

export interface IStudent { 
    _id: string;
    name: string;
    enrollmentNo: number;
    course: string;
    rollNo: string;
    year: number;
    semester: number;
    academicYear: string;
    isDeleted: boolean;
    isSuspended: boolean;
    courseId: number;
    createdAt: Date;
    updatedAt: Date;
}

const Student = model("Student", StudentSchema);

export default Student;