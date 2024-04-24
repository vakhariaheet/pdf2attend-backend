import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const CheckUsernameValidate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { query } = req.query;
	if (!query)
		return sendResponse({
			res,
			status: 400,
			message: 'Bad Request',
		});
	next();
};

export default CheckUsernameValidate;
