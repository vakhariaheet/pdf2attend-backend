import { Schema, model } from "mongoose";

export interface ISubject { 
    name: string;
    courseId: string;
    sem: string;
    shift: string;
    academicYear: string;
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string;

}

const SubjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
    },
    sem: {
        type: String,
    },
    shift: {
        type: String,
    },
    academicYear: {
        type: String,
    }
},{timestamps: true})

const Subject = model("Subject", SubjectSchema);

export default Subject;