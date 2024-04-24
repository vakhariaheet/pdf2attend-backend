import User from '@/Models/User';
import { hash } from '@/Service/Encryption';
import JWT from '@/Service/JWT';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const SaveNewUser = async (req: Request, res: Response) => {
	try {
		const { password, token } = req.body;
		const data = JWT.verify(token, process.env.JWT_SECRET);
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
		const hashedPassword = await hash(password);
		user.password = hashedPassword;
		user.isUserNew = false;
		await user.save();
		const accessTokenExpireTime = new Date(
			Date.now() + 3 * 60 * 60 * 1000,
		).getTime();
		const refreshTokenExpireTime = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000,
		).getTime();
		const accessToken = JWT.sign(
			{ ...data, exp: accessTokenExpireTime },
			process.env.JWT_SECRET as string,
		);
		const refreshToken = JWT.sign(
			{ ...data, exp: refreshTokenExpireTime },
			process.env.JWT_SECRET as string,
		);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: process.env.NODE_ENV === 'production' ? true : false,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
			domain:
				process.env.NODE_ENV === 'production' ? '.pdf2attend.xyz' : undefined,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});
		res.cookie('accessToken', accessToken, {
			httpOnly: process.env.NODE_ENV === 'production' ? true : false,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
			domain:
				process.env.NODE_ENV === 'production' ? '.pdf2attend.xyz' : undefined,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});
		sendResponse({
			res,
			message: 'Password saved successfully',
			status: 200,
			data: {
				user,
			},
		});
	} catch (error) {}
};

export default SaveNewUser;
