import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const VerifyLectureValidate = (req: Request, res: Response, next: NextFunction) => {
  const { lectureId } = req.params;
  const { studentAttendance } = req.body;
  
  if (!lectureId || !studentAttendance) { 
    return sendResponse({
      res,
      status: 400,
      message: 'Bad Request',
      data: null
    })
  }
  next();
};

export default VerifyLectureValidate;