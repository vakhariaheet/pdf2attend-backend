import { Response, NextFunction, Request } from 'express';
import { FileRequest } from '@/types';
import { sendResponse } from '@/utils/Response';

const SUPPORTED_FORMATS = ['text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/x-csv', 'application/x-csv', 'text/x-comma-separated-values', 'text/tab-separated-values','application/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.apple.numbers'];

const BulkRegisterValidate = (req: Request, res: Response, next: NextFunction) => {

  if (!req.file) { 
    return sendResponse({
      res,
      message: 'No file uploaded',
      status: 400,
    })
  }
  if (!SUPPORTED_FORMATS.includes(req.file.mimetype)) { 
    return sendResponse({
      res,
      message: 'Invalid file format',
      status: 400,
    })
  }
  
  next();
};

export default BulkRegisterValidate;