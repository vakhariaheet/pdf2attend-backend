import { Request, Response, NextFunction } from 'express';

const AddLectureValidate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default AddLectureValidate;