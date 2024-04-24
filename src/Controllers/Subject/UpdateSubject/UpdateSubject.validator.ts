import Subject from '@/Models/Subject';
import { sendResponse } from '@/utils/Response';
import { Request, Response, NextFunction } from 'express';

const UpdateSubjectValidate = async (req: Request, res: Response, next: NextFunction) => {
  const { name, courseId, sem, shift = "day", academicYear } = req.body;
  
  const subjectInDb = await Subject.findOne({ name, courseId, sem, shift, academicYear });

  if (subjectInDb) return sendResponse({
    res,
    status: 400,
    message: "Subject already exists"
  })

  if (shift !== "day" && shift !== "noon") return sendResponse({
    res,
    status: 400,
    message: "Shift can only be day or noon"
  });
  if (!isNaN(Number(name)) || !isNaN(Number(academicYear)))
    return sendResponse({
      res,
      status: 400,
      message: "Name, course and academic year cannot be a number",
    });
  if (isNaN(Number(sem))) return sendResponse({
    res,
    status: 400,
    message: "Semester must be a number",
  });
  
  if (!name || !courseId || !sem || !shift || !academicYear) { 
    return sendResponse({
      res,
      status: 400,
      message: "Please provide all the required fields",
    });
  }

  next();
};

export default UpdateSubjectValidate;