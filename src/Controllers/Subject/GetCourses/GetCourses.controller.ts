import Course from '@/Models/Course';
import { getOrSetCache } from '@/Service/Redis';
import { getLogger } from '@/utils/Logger';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const GetCourses = async (req: Request, res: Response) => {
  try {
    const resp =await getOrSetCache("courses", async () => {
      const courses = await Course.find({});
      return {
        courses
      };
    })
    console.log(resp);
    return sendResponse({
      res,
      data: resp,
      status: 200,
    })
   

  } catch (error:any) {
    const logger = getLogger();
    logger.error(error.toString());
    sendResponse({
      res,
      status: 500,
    })
 }
};

export default GetCourses;