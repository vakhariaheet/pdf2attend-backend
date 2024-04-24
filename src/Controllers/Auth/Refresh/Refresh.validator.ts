import { Request, Response, NextFunction } from 'express';

const RefreshValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default RefreshValidate;