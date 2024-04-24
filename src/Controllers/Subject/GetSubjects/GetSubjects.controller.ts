import Subject from '@/Models/Subject';
import { getOrSetCache } from '@/Service/Redis';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const GetSubjects = async (req: Request, res: Response) => {
  try {
    const { q = "" } = req.query;
    const resp = await getOrSetCache(`subjects:${q}`, async () => {
      const subjects = await Subject.find({ name: { $regex: q, $options: 'i' } });
      return {
        subjects,
      };
    });
    return sendResponse({
      res,
      status: 200,
      data: {
        subjects: resp.subjects,
      },
      
    })
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: "Something went wrong",
    });
 }
};

export default GetSubjects;