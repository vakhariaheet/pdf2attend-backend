import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';
const SUPPORTED_FORMATS = ['text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/x-csv', 'application/x-csv', 'text/x-comma-separated-values', 'text/tab-separated-values','application/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.apple.numbers'];

const AddClassValidate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) { 
    return sendResponse({
      res,
      status: 400,
      message: 'Please upload a file'
    })
  }
  if (!SUPPORTED_FORMATS.includes(req.file.mimetype)) { 
    return sendResponse({
      res,
      message: 'Invalid file format',
      status: 400,
    })
  }  
  const { course, div, academicYear, sem } = req.query;
  if (!course || !div || !academicYear || !sem) { 
    return sendResponse({
      res,
      message: 'Please provide all the required fields',
      status: 400,
    })
  }
  next();
};

export default AddClassValidate;