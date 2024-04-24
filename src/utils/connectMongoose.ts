import mongoose from "mongoose";

const connectMongoose = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
        
        });
        console.log("Connected to MongoDB 🔥 🔥");
    } catch (error) {
        console.log(error);
    }
}

export default connectMongoose;
