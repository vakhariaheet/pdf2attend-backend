import Batch from '@/Models/Batch';
import { RequestUser } from '@/types';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const AllBatches = async (req: Request, res: Response) => {
	try {
		const user = req.user as RequestUser;

		const batches = await Batch.find(user.role === 'admin' ? {} : {
			facultyIds: {
				$in: [user._id],
			},
		});
		return sendResponse({
			res,
			status: 200,
			data: {
				batches,
			},
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

export default AllBatches;
