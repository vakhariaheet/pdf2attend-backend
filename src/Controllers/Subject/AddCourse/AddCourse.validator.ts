import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const AddCourseValidate = (req: Request, res: Response, next: NextFunction) => {
  const { id, name } = req.body;
  if (!id || !name) return sendResponse({
    res,
    data: null,
    status: 400,
    message:"Id and Name Not Found"
  })
  
  next();
};

export default AddCourseValidate;