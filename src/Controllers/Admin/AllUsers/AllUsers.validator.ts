import { Request, Response, NextFunction } from 'express';

const AllUsersValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default AllUsersValidate;