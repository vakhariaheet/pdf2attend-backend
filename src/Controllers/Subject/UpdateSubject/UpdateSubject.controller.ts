import Subject from '@/Models/Subject';
import { deleteCache } from '@/Service/Redis';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const UpdateSubject = async (req: Request, res: Response) => {
  try {
    const subjectConfig = req.body;
    await Subject.updateOne({ _id: req.params.id }, subjectConfig);
    await deleteCache(`subject*`);
    return sendResponse({
      res,
      status: 200,
      message: "Subject updated successfully",
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      status: 500,
      message: "Something went wrong",
    });
 }
};

export default UpdateSubject;