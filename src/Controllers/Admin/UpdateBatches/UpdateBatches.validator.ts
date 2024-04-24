import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const UpdateBatchesValidate = (req: Request, res: Response, next: NextFunction) => {
  const { userId, batches } = req.body;
  if (!userId || !batches) {
    return sendResponse({
      res,
      status: 400,
      message: 'Bad Request',
      data: null,
    })
  }
  next();
};

export default UpdateBatchesValidate;