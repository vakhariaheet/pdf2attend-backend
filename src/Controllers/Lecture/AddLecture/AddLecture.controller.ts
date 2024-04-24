import Lecture from '@/Models/Lecture';
import { deleteCache } from '@/Service/Redis';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const AddLecture = async (req: Request, res: Response) => {
  try {
    const { batchId, date,timing } = req.body;
    const lecture = await Lecture.create({
      batchId,
      date,
      type: "extra",
      timing
    })
    await deleteCache(`${req.user?._id}:lectures*`);
    return sendResponse({
      res,
      status: 200,
      message: "Lecture added successfully",
      data: {
        lecture
      }
    })
  } catch (error) {
    console.log(error);
    return sendResponse({
      res,
      status: 500,
      message: "Something went wrong",
    });
 }
};

export default AddLecture;