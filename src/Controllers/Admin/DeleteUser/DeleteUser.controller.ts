import User from '@/Models/User';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    return sendResponse({
      res,
      status: 200,
      message: 'User Deleted',
    })
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      status: 500,
      message: 'Internal Server Error',
      data:error
    })
 }
};

export default DeleteUser;