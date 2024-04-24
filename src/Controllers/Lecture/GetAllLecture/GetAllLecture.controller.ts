import { Request, Response } from 'express';
import { RequestUser } from '@/types';
import { getOrSetCache } from '@/Service/Redis';
import Lecture from '@/Models/Lecture';
import Batch from '@/Models/Batch';
import { sendResponse } from '@/utils/Response';
import { getLogger } from '@/utils/Logger';
import { ObjectId } from 'mongoose';
import { IUser } from '@/Models/User';
import { ISubject } from '@/Models/Subject';
import getRelativeDate from '@/utils/Date';
import Course, { ICourse } from '@/Models/Course';

export interface BatchWithSubject {
	_id: ObjectId;
	subjectId: Omit<ISubject, 'courseId'> & {
		courseId: ICourse;
	};
	facultyIds: IUser[];
	hasMultipleFaculty: boolean;
	enrollmentNos: number[];
	name: string;
	__v: number;
}

const GetAllLecture = async (req: Request, res: Response) => {
	try {
		const {
			page,
			limit = 10,
			status = 'All',
			q = '',
			course,
			year ,
			subject,
			dateRange,
		} = req.query;
		const user = req.user as RequestUser;

		const resp = await getOrSetCache(
			`${user._id}:lectures?page=${page}&limit=${limit}&status=${status}&q=${q}&course=${course}&year=${year}&subject=${subject}&dateRange=${dateRange}`,
			async () => {
				const batches = (
					(await Promise.all(
						(
							await Batch.find({
								facultyIds: {
									$in: [ user._id ],
								},
							})
								.populate([
									{
										path: 'subjectId',
									},
									{
										path: 'facultyIds',
									},
									{
										path: 'subjectId',
										populate: {
											path: 'courseId',
											strictPopulate: false,
										},
									},
								])
								.exec()
						).map(async (batch) => {
							const batchWithSubject = batch.toObject() as BatchWithSubject;
							const course = await Course.findById(
								batchWithSubject?.subjectId?.courseId,
							);

							return {
								...batchWithSubject,
								subjectId: {
									...batchWithSubject.subjectId,
									courseId: course?.toObject(),
								},
							};
						}),
					)) as BatchWithSubject[]
				).filter((batch) => {
					if (!course || !year || !subject) return false;
					
					const query =
						batch.name.includes(q as string) ||
						batch?.subjectId?.name.includes(q as string);
					const courseQuery =
						course === 'All' ||
						batch?.subjectId?.courseId.name?.includes(
							course.toString().split('-')[ 0 ],
						);

					const sems = year.toString().split('-').map((sem) => [ (Number(sem) * 2 - 1).toString(), (Number(sem) * 2 - 1).toString() ]).flat();
					const yearQuery =
						year === 'All' ||
						sems.includes(batch.subjectId.sem) ||
						sems.includes(batch.subjectId.sem);
					const subjectQuery =
						subject === 'All' ||
						subject.toString().split('-').some(sub => batch?.subjectId?.name?.includes(sub));

					return query && courseQuery && yearQuery && subjectQuery;
				});
				const endDate = dateRange
					? Number(dateRange?.toString().split('-')[ 1 ])
					: new Date().getTime();
				const startDate = dateRange
					? Number(dateRange?.toString().split('-')[ 0 ])
					: 0;
				const sortedLecture: {
					relativeDate: string;
					date: number;
					lectures: any[]
				}[] = [];
				const totalLectures = await Lecture.countDocuments({
					batchId: {
						$in: batches.map((batch) => batch._id),
					},
					date: {
						$gte: startDate,
						$lte: endDate,
					},
					status:
						status === 'All'
							? { $in: [ 'pending', 'completed', 'processing' ] }
							: status,
				});
				const totalPages = Math.ceil(totalLectures / Number(limit));
				const skip = (Number(page) - 1) * Number(limit);
				const batchIds = batches.map((batch) => batch._id);
				(
					await Lecture.find({
						batchId: {
							$in: batchIds,
						},
						date: {
							$gte: startDate,
							$lte: endDate,
						},
					}).sort({ date: -1 })
						.skip(skip)
						.limit(Number(limit))
				).forEach((lecture) => {
					const date = getRelativeDate(lecture.date);
					if (!sortedLecture.find((lec) => lec.relativeDate === date)) {
						sortedLecture.push({
							relativeDate: date,
							date: new Date(lecture.date).getTime(),
							lectures: [],
						})
					}
					const index = sortedLecture.findIndex((lec) => lec.relativeDate === date);
					const batch = batches.find(
						(batch) => batch._id.toString() === lecture.batchId.toString(),
					);
					const subject = batch?.subjectId;
					if (status === 'pending' && lecture.status !== 'pending') return null;
					if (status === 'completed' && lecture.status !== 'completed')
						return null;
					sortedLecture[index].lectures.push({
						...lecture.toObject(),
						sem: subject?.sem,
						shift: subject?.shift,
						academicYear: subject?.academicYear,
						course: subject?.courseId.name,
						subjectName: subject?.name,
						batchName: batch?.name,
						faculties: batch?.facultyIds.map((faculty) => ({
							name: faculty.name,
							_id: faculty._id,
							username: faculty.username,
							email: faculty.email,
						})),
					});
					if(!sortedLecture[index].lectures) delete sortedLecture[index];
				});
				sortedLecture.sort((a, b) => b.date - a.date);
				sortedLecture.forEach((lec) => { 
					lec.lectures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
				})
				return {
					lectures: sortedLecture,
					totalPages,
					total: totalLectures,
				};
			},
		);
		return sendResponse({
			res,
			status: 200,
			data: resp,
		});
	} catch (error: any) {
		const logger = getLogger();
		logger.error(error.toString());
		return sendResponse({
			res,
			status: 500,
			message: 'Something went wrong',
		});
	}
};

export default GetAllLecture;
