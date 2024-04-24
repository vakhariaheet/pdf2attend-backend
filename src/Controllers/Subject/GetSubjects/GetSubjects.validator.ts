import { Request, Response, NextFunction } from 'express';

const GetSubjectsValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default GetSubjectsValidate;