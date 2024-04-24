import User from '@/Models/User';
import JWT from '@/Service/JWT';
import { getCookies, parseCookieString } from '@/utils/Cookie';
import { getLogger } from '@/utils/Logger';
import { sendResponse } from '@/utils/Response';
import { NextFunction, Request, Response } from 'express';
import { Socket, } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = getCookies(req)?.accessToken;
	
		if (!token)
			return sendResponse({
				res,
				message: 'Invalid token',
				status: 403,
			});
		const data = JWT.verify(token, process.env.JWT_SECRET as string);
		if (typeof data !== 'object')
			return sendResponse({
				res,
				message: 'JWT Verification failed',
				status: 403,
			});
		if (!('id' in data))
			return sendResponse({
				res,
				message: 'Id not found in token',
				status: 403,
			});
		const user = await User.findById(data.id);
		if (!user)
			return sendResponse({
				res,
				message: 'User not found',
				status: 404,
			});
		if (user.isNew)
			return sendResponse({
				res,
				message: 'Account setup is left',
				status: 400,
			});

		req.user = user.toObject();
		next();
    } catch (error) {
        const logger = getLogger();
        logger.error(error);
		return sendResponse({
			res,
			message: 'Something went wrong',
			status: 500,
		});
	}
};

export const VerifyTokenSocket = async (socket: Socket,next:(err:ExtendedError|undefined) => void) => { 
	try {
		const req = socket.request;
		const cookies = parseCookieString(req.headers.cookie || '');
		if (!cookies) return socket.disconnect(true);
		if (!cookies.accessToken || !cookies.refreshToken) return socket.disconnect(true);
		const data = await JWT.verify(cookies.accessToken, process.env.JWT_SECRET);
		if (!data) return socket.disconnect(true);
		if (typeof data !== 'object')
			return socket.disconnect(true);
		if (!('id' in data))
			return 		socket.disconnect(true);
		const user = await User.findById(data.id);
		if (!user)
			return socket.disconnect(true);
		if (user.isNew)
			return socket.disconnect(true);

		socket.user = user.toObject();
		next(undefined);
	}
	catch (err:any) { 
		const logger = getLogger();
		logger.error(err.toString());
		socket.disconnect(true);
	}
	
}

export default VerifyToken;