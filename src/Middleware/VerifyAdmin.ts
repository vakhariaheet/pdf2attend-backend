import User from '@/Models/User';
import JWT from '@/Service/JWT';
import { RequestUser } from '@/types';
import { sendResponse } from '@/utils/Response';
import { NextFunction, Request, Response } from 'express';

const VerifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
        const user = req.user as RequestUser;
        if(user.role !== "admin") {
            return sendResponse({
                res,
                message: "Unauthorized",
                status: 403,
            })
        }
        next();
	} catch (error) {
		return sendResponse({
			res,
			message: 'Invalid token',
			status: 403,
		});
	}
};

export default VerifyAdmin;