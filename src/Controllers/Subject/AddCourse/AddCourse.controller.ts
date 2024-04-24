import Course from '@/Models/Course';
import { RequestUser } from '@/types';
import { Request, Response } from 'express';
import { sendResponse } from '../../../utils/Response';
import { getLogger } from '@/utils/Logger';
import { deleteCache } from '@/Service/Redis';

const AddCourse = async (req: Request, res: Response) => {
	try {
		const { id, name } = req.body;

		const insertedCourse = await Course.insertMany({
			_id: id,
			name,
    });
    deleteCache("courses");
		return sendResponse({
			res,
			data: {
				insertedCourse,
			},
			status: 200,
			message: 'Course Inserted',
		});
	} catch (error: any) {
		const logger = getLogger();
		logger.error(error.toString());
		sendResponse({
			res,
			status: 500,
		});
	}
};

export default AddCourse;
