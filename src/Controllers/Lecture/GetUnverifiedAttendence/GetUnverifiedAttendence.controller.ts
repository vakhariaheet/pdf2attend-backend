import Lecture from '@/Models/Lecture';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';
import axios from 'axios';
import Batch from '@/Models/Batch';
import Student from '@/Models/Student';

const GetUnverifiedAttendence = async (req: Request, res: Response) => {
	try {
		const { lectureId } = req.params;
		const lecture = (await Lecture.findById(lectureId).populate(
			'batchId',
		)) as any;
		if (!lecture) {
			return sendResponse({
				res,
				status: 404,
				message: 'Lecture Not Found',
			});
		}
		const { data: scannedJSON } = await axios.get<any[][][]>(
			`https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${lecture.batchId._id}/${lectureId}/${lectureId}.json`,
		);

		const students = await Student.find({
			enrollmentNo: {
				$in: lecture.batchId.enrollmentNos,
			},
		});
		const temp: any[] = [];
		scannedJSON.forEach((page) => {
			page.forEach((row) => {
				const student = students.find(
					(student) =>
						student.rollNo.toLowerCase() === row[0]?.text.toLowerCase(),
				);
				if (student)
					temp.push({
						...student.toObject(),
						status: row[row.length - 1].text,
					});
			});
		});
		const studentAttendence = students.map((student) => {
			const tempStudent = temp.find(
				(tempStudent) => tempStudent._id.toString() === student._id.toString(),
			);
			if (tempStudent) {
				return tempStudent;
			}
			return {
				...student.toObject(),
				status: 'Absent',
			};
		});
		return sendResponse({
			res,
			status: 200,
      data: {
        studentAttendence,
        ocr:scannedJSON
      },
		});
	} catch (error) {
		console.log(error);
		return sendResponse({
			res,
			status: 500,
			message: 'Internal Server Error',
		});
	}
};

export default GetUnverifiedAttendence;
