import { Schema, model } from "mongoose";

export interface ICourse { 
    name: string;
    _id: string;
}

const courseSchema = new Schema({
    _id: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    }
})


const Course = model("course", courseSchema);
export default Course;