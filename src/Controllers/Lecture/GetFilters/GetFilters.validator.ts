import { Request, Response, NextFunction } from 'express';

const GetFiltersValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default GetFiltersValidate;