import Subject from '@/Models/Subject';
import { deleteCache } from '@/Service/Redis';
import { getLogger } from '@/utils/Logger';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const AddSubject = async (req: Request, res: Response) => {
  try {
    const { name, course, sem, shift = "day", academicYear } = req.body;
    const subject = await Subject.insertMany([{
      name,
      course,
      sem,
      shift,
      academicYear
    }]);
    await deleteCache(`subject*`);
    return sendResponse({
      res,
      status: 200,
      message: "Subject added successfully",
      data: {
        subject
      }
    })


  } catch (error:any) {
    const logger = getLogger();
    logger.error(error.toString());
    return sendResponse({
      res,
      status: 500,
      message: "Something went wrong",
    });
 }
};

export default AddSubject;