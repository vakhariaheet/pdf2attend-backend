import JWT from '@/Service/JWT';
import { getCookies } from '@/utils/Cookie';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const Refresh = (req: Request, res: Response) => {
  try {

		const tokens = getCookies(req);
		if (!tokens) {
			return sendResponse({
				res,
				status: 401,
				message: 'Unauthorized',
			});
		}
		const { refreshToken } = tokens;
		if (!refreshToken) {
			return sendResponse({
				res,
				status: 401,
				message: 'Unauthorized',
			});
		}
		const data = JWT.verify(refreshToken, process.env.JWT_SECRET as string);
		if (!data) {
			return sendResponse({
				res,
				status: 401,
				message: 'Unauthorized',
			});
		}
		if (typeof data !== 'object')
			return sendResponse({
				res,
				message: 'Invalid token',
				status: 403,
			});
		if (!('id' in data))
			return sendResponse({
				res,
				message: 'Invalid token',
				status: 403,
			});
		const accessToken = JWT.sign(
			{ id: data.id, iat: Date.now() },
			process.env.JWT_SECRET as string,
			{
				expiresIn: '3h',
			},
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.pdf2attend.xyz' : undefined,
    });

		return sendResponse({
			res,
			status: 200,
			message: 'Token refreshed',
			data: null,
		});
  } catch (error) {
    console.log(error);
  }
};

export default Refresh;
