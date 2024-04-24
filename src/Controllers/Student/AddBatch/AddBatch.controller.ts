import Batch from '@/Models/Batch';
import Course from '@/Models/Course';
import Student from '@/Models/Student';
import Subject from '@/Models/Subject';
import { getLogger } from '@/utils/Logger';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

interface EnrollNoRange {
	type: 'direct' | 'range';
	value: string;
}

const AddBatch = async (req: Request, res: Response) => {
	try {
		const { enrollRange, courseId, facultyIds, subjectId, name } = req.body;
		const enrollmentNos: number[] = [];

		await Promise.all(
			enrollRange.map(async (enroll: EnrollNoRange) => {
				if (enroll.type === 'direct') {
					enrollmentNos.push(Number(enroll.value));
				} else {
					const [ start, end ] = enroll.value.split('-');
	
					const enrollmentNoInDB = (
						await Student.find(
							{
								enrollmentNo: {
									$gte: Number(start),
									$lte: Number(end),
								},
							},
							{
								enrollmentNo: 1,
							},
						)
					).map((student) => student.enrollmentNo);
		
					enrollmentNos.push(...enrollmentNoInDB);
				}
			}),
		);
		enrollmentNos.sort((a, b) => a - b);
		const hasMultipleFaculty = facultyIds.length > 1;

		const subject = (await Subject.findById(subjectId))?.toObject();
		if (!subject) { 
			return sendResponse({
				res,
				status: 400,
				message: 'Subject not found',
			});
		}
		const student = (await Student.find({
			enrollmentNo: {
				$in: enrollmentNos,
			}
			
		}))?.every((student) => student.semester === subject.sem);
		if (subject.courseId !== courseId) { 
			return sendResponse({
				res,
				status: 400,
				message: 'Course not found',
			});
		}


		
		if (!student) { 
			return sendResponse({
				res,
				status: 400,
				message: 'All students must have access to the subject, please check the enrollment numbers',
			});
		}
		const batch = await Batch.insertMany([
			{
				courseId,
				enrollmentNos,
				facultyIds,
				hasMultipleFaculty,
				subjectId,
				name,
			},
		]);

		return sendResponse({
			res,
			status: 200,
			data: {
				batch,
			},
		});
	} catch (error: any) {
		console.log(error);
		const logger = getLogger();
		logger.error(error.toString());
		return sendResponse({
			res,
			status: 500,
			message: 'Something went wrong',
		});
	}
};

export default AddBatch;
