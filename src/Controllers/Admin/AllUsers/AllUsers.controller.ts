import User from '@/Models/User';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const AllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return sendResponse({
      res,
      status: 200,
      data: {
        users,
      },
    })

 } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: 'Internal Server Error',

    })
  }
};

export default AllUsers;