import { Schema, model } from "mongoose";

export interface IUser { 
    name: string;
    username: string;
    password: string;
    email: string;
    role: "admin" | "faculty";
    isUserNew: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        default: null,
        
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "faculty"],
        default: "faculty",
        required: true,
    },
    isUserNew: {
        type: Boolean,
        default: true,
        required: true,
    },
}, {
    timestamps: true,
})
const User = model("User", UserSchema);


export default User;
