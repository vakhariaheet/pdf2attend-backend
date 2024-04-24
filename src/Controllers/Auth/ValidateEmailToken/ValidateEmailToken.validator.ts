import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const ValidateEmailTokenValidate = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  if (!token) { 
    return sendResponse({
      res,
      status: 400,
      message: 'Bad Request',
      data: null
    });
  }
  next();
};

export default ValidateEmailTokenValidate;