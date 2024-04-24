import data from './data.json';
import connectMongoose from './src/utils/connectMongoose';
import Lecture from './src/Models/Lecture';
import mongoose from 'mongoose';
(async () => { 
    await mongoose.connect('mongodb://localhost:27017/pdf2attend', {
        
    });
    await Lecture.updateMany({}, { $set: { jobId: null,status:"pending" } })
})()




