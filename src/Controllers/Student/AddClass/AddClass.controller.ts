import Student from '@/Models/Student';
import SheetJS from '@/Service/SheetJS';
import { getLogger } from '@/utils/Logger';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const AddClass = async (req: Request, res: Response) => {
	try {
		const file = req.file as Express.Multer.File;
		
		const { course, div, academicYear, sem } = req.body;
		const studentsInfo = await SheetJS.readFile<{
			'Student Name': string;
			'Roll No': string;
			'Enrollment No.': string;
		}>(file.path);
	
		const courseId =(studentsInfo[0]['Enrollment No.']).toString().substring(4).slice(0, -3);
		const year = Number(sem) % 2 === 0 ? Number(sem) / 2 : (Number(sem) + 1) / 2;
		const students = studentsInfo.map((student) => {
			let rollNo = student['Roll No'];
			if (!isNaN(Number(rollNo))) {
				rollNo = div + Number(rollNo).toString();
			}
			return {
				name: student['Student Name'],
				rollNo,
				enrollmentNo: student['Enrollment No.'],
				year:Number(year),
				academicYear,
				course,
				courseId:Number(courseId),
				semester: Number(sem),
				div,
			};
		}).filter((student) => student.name);

		const insertedStudents = await Student.insertMany(students);
		return sendResponse({
			res,
			status: 200,
			message: 'Students Added Successfully',
			data:insertedStudents,
		});
	} catch (error: any) {
		const logger = getLogger();
		logger.error(error.toString());
		return sendResponse({
			res,
			status: 500,
			message: 'Internal Server Error',
		});
	}
};

export default AddClass;
