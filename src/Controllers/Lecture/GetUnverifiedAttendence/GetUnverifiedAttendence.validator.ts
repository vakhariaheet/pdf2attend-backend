import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const GetUnverifiedAttendenceValidate = (req: Request, res: Response, next: NextFunction) => {
  const { lectureId } = req.params;
  if (!lectureId) {
    return sendResponse({
      res,
      status: 400,
      message: "Lecture Id is required"
    })
  }
  next();
};

export default GetUnverifiedAttendenceValidate;