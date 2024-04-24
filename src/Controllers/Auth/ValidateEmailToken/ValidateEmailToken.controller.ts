import User from '@/Models/User';
import JWT from '@/Service/JWT';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const ValidateEmailToken = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;
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
    sendResponse({
      res,
      message: 'Email verified successfully',
      status: 200,
      data: {
        user,
      }
    })
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      message: 'Something went wrong',
      status: 500,
    });
  }
};

export default ValidateEmailToken;
