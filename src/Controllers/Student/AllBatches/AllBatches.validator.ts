import { Request, Response, NextFunction } from 'express';

const AllBatchesValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default AllBatchesValidate;