import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const Profile = (req: Request, res: Response) => {
  try {
    const { user } = req;
    return sendResponse({
      res,
      status: 200,
      data: {
        user,
      },
    })
 } catch (error) {
 }
};

export default Profile;