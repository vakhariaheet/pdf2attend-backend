import Batch from '@/Models/Batch';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const UpdateBatches = async (req: Request, res: Response) => {
	try {
		const { userId, batches } = req.body;
		const userBatches = (
			await Batch.find({ facultyIds: { $in: [userId] } })
		).map((batch) => batch._id.toString());
		const batchesToBeRemoved = userBatches.filter(
			(batchId) => !batches.includes(batchId),
		);
		const batchesToBeAdded = batches.filter(
			(batchId: string) => !userBatches.includes(batchId),
		);
		await Batch.updateMany(
			{ _id: { $in: batchesToBeRemoved } },
			{
				$pull: { facultyIds: userId },
			},
		);
		await Batch.updateMany(
			{ _id: { $in: batchesToBeAdded } },
			{
				$push: { facultyIds: userId },
			},
		);

		return sendResponse({
			res,
			status: 200,
			message: 'Batch Updated',
		});
	} catch (error) {
		console.log(error);
		return sendResponse({
			res,
			status: 500,
			message: 'Internal Server Error',
			data: {
				error,
			},
		});
	}
};

export default UpdateBatches;
