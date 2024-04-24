import { Request, Response, NextFunction } from 'express';

const SaveNewUserValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default SaveNewUserValidate;