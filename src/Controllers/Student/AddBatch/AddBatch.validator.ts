import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const AddBatchValidate = (req: Request, res: Response, next: NextFunction) => {
  const { enrollRange, courseId, facultyIds, subjectId, name } = req.body;
  if (!enrollRange || !courseId || !facultyIds || !subjectId || !name) { 
    return sendResponse({
      res,
      status: 400,
      message: "Please provide all the required fields",
    });
  }
  next();
};

export default AddBatchValidate;