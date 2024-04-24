import { Request, Response, NextFunction } from 'express';

const GetCoursesValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default GetCoursesValidate;