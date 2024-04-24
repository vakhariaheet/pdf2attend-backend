import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const UploadPDFValidate = (req: Request, res: Response, next: NextFunction) => {
  const { lectureId } = req.params;
  if (!lectureId) return sendResponse({
    res,
    data: null,
    status: 400,
    message:"Lecture Id Not Found"
  })
  if (req.files === null) return sendResponse({
    res,
    data: null,
    status: 400,
    message:"File Not Found"
  })
  
  next();
};

export default UploadPDFValidate;