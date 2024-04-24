import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const DeleteUserValidate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { userId } = req.params;
	if (!userId) {
		return sendResponse({
			res,
			status: 400,
			message: 'Bad Request',
		});
	}
	next();
};

export default DeleteUserValidate;
