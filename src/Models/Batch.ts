import { Schema, model } from 'mongoose';

export interface IBatch { 
	name: string;
	subjectId: string;
	facultyIds: string[];
	hasMultipleFaculty: boolean;
	enrollmentNos: number[];
	_id: string;
	__v: number;
	createdAt: string;
	updatedAt: string;
}


const BatchSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
	subjectId: {
		type: Schema.Types.ObjectId,
		ref: 'Subject',
	},
	facultyIds: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	hasMultipleFaculty: {
		type: Boolean,
	},
	enrollmentNos: [
		{
			type:Number,
		},
	],
},{timestamps: true});

const Batch = model('Batch', BatchSchema);
export default Batch;
