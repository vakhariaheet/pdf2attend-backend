import User from '@/Models/User';
import { getOrSetCache } from '@/Service/Redis';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const CheckUsername = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const resp =await getOrSetCache(`username:${query}`, async () => { 
      const { username } = await User.findOne({ username: query },{ username: 1, _id: 0 }) || { username: null };
      if (!username) return false;
      return true;
    });
    return sendResponse({
      res,
      status: 200,
      data: {
        isAvailable: !resp,
      },

    })
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      status: 500,
      message: 'Internal Server Error',
    })
 }
};

export default CheckUsername;