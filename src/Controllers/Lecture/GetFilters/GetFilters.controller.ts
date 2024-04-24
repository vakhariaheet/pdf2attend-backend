import Batch, { IBatch } from '@/Models/Batch';
import Course, { ICourse } from '@/Models/Course';
import Lecture from '@/Models/Lecture';
import { ISubject } from '@/Models/Subject';
import { getLogger } from '@/utils/Logger';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

interface FilterBatch extends Omit<IBatch, 'subjectId'> {
	subjectId: Omit<ISubject, 'courseId'> & {
		courseId: ICourse;
	};
}

const GetFilters = async (req: Request, res: Response) => {
	try {
		const batches = (
			await Batch.find({
				facultyIds: {
					$in: [req.user?._id],
				},
			}).populate('subjectId')
		).map((batch) => batch.toObject()) as FilterBatch[];
		const courses = new Set<string>();

		const years = new Set<number>();
		const subjects = new Set<string>();
		let minDate = new Date().getTime();
    let maxDate = new Date().getTime();
    
    const allLectures = (await Lecture.find({
      batchId: {
        $in: batches.map((batch) => batch._id)
      }

    })).map((lec) => {
      const lecture = lec.toObject()
      if (lecture.date.getTime() < minDate) { 
        minDate = lecture.date.getTime();
      }
      if (lecture.date.getTime() > maxDate) {
        maxDate = lecture.date.getTime();
      }
    });

		batches.forEach(async (batch) => {
			courses.add(batch.subjectId.courseId.name);
			const year =
				Number(batch.subjectId.sem) % 2 === 0
					? Number(batch.subjectId.sem) / 2
					: (Number(batch.subjectId.sem) + 1) / 2;
			years.add(year);
			subjects.add(batch.subjectId.name);
		});

		return sendResponse({
			res,
			data: {
				courses:
					Array.from(courses).length > 1 ? Array.from(courses) : undefined,
				years:
					Array.from(years).length > 1
						? Array.from(years).sort((a, b) => a - b)
						: undefined,
				subjects:
					Array.from(subjects).length > 1 ? Array.from(subjects) : undefined,
				minDate,
				maxDate,
			},
			status: 200,
		});
	} catch (error: any) {
		const logger = getLogger();
		logger.error(error.toString());

		return sendResponse({
			res,
			status: 500,
		});
	}
};

export default GetFilters;
