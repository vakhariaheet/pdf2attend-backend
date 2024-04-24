import {
	StartDocumentAnalysisCommand,
	GetDocumentAnalysisCommand,
	TextractClient,
	GetDocumentAnalysisCommandOutput,
} from '@aws-sdk/client-textract';
import dotenv from 'dotenv';
import fs from 'fs';
import { Socket } from 'socket.io';
const client = new TextractClient({ region: 'ap-south-1' });
import { setTimeoutAsync } from './utils';
import { RequestUser } from '@/types';
import Lecture from '@/Models/Lecture';
import { getLecture } from './getLecture';
import { deleteCache } from '@/Service/Redis';
import { upload } from './UploadS3';
import { IBatch } from '@/Models/Batch';
import Student from '@/Models/Student';
dotenv.config();
interface ScanFileProps {
	fileName: string;
	socket: Socket;
	user: RequestUser;
	lectureId: string;
}

export const scanFile = async (props: ScanFileProps): Promise<any[][][]> =>
	new Promise(async (resolve, reject) => {
		const { fileName, socket, user, lectureId } = props;
		const batch = (await Lecture.findById(lectureId).populate('batchId'))?.batchId as IBatch | undefined;
		if (!batch)
			return socket.emit('log', {
				data: 'Batch Not Found',
			});
		const students = (await Student.find({
			enrollmentNo: {
				$in: batch.enrollmentNos,
			}
		})).map((student) => student.toObject());
		if (!students) {
			return socket.emit('log', {
				data: 'Students Not Found',
			});
		}
		
		const command = new StartDocumentAnalysisCommand({
			DocumentLocation: {
				S3Object: {
					Bucket: process.env.AWS_BUCKET,
					Name: fileName,
				},
			},
			FeatureTypes: ['TABLES'],
		});

		try {
			const data = await client.send(command);
			await Lecture.findByIdAndUpdate(
				lectureId,
				{
					$set: {
						jobId: data.JobId,
						status: 'processing',
					},
				},
				{ new: true },
			);
			await deleteCache(`${user?._id}:lectures*`);
			socket.emit('update-lecture', {
				lecture: await getLecture(lectureId),
			});

			const JobId = data.JobId;
			const table: any[][][] = [];
			const ocr = async (JobId: string, NextToken?: string) => {
				const detextCommand = new GetDocumentAnalysisCommand({
					JobId,
					NextToken,
				});
				const detextData = await client.send(detextCommand);

				const status = detextData.JobStatus;
				if (!status) return;
				if (status === 'IN_PROGRESS') {
					socket.emit('log', {
						data: 'Currently Scanning PDF Rechecking in 4s',
					});
					await setTimeoutAsync(async () => {
						await ocr(JobId, NextToken);
					}, 4000);
					return;
				}
				fs.writeFileSync('data.json', JSON.stringify(detextData));
				const block = detextData.Blocks;

				if (!block)
					return socket.emit('log', {
						data: 'No blocks found in the document. Try again.',
					});

				const tableData = getTable(detextData, {
					columnsName:['Roll No','Name','Enrollment','Signature']
				});
				if (tableData)
					table.push(
						tableData.map((row) => {
							return row.map((cell, index) => {
								if(index === 0) return cell;
								if (index === row.length - 1)
									return {
										...cell,
										text: cell.text ? 'Present' : 'Absent',
									};
								return cell;
							});
						}),
					);
				socket.emit('log', {
					data: 'File Read Successfully',
				});
				if (detextData.NextToken) {
					ocr(JobId, detextData.NextToken);
					return;
				}
				await Lecture.findByIdAndUpdate(
					lectureId,
					{
						$set: {
							jobId: data.JobId,
							status: 'completed',
						},
					},
					{ new: true },
				);
				const filteredTable = table
					.filter((page) => page)
					.map((page) => page.filter((row) => row));
				const studentAttendence:any[] = []
				filteredTable.forEach((page) => {
					page.forEach((row) => {
						const student = students.find((student) => student.rollNo.toLowerCase() === row[ 0 ]?.text.toLowerCase());
						if (student) studentAttendence.push({
							...student,
							status: row[ row.length - 1 ].text
						})
					})
				});
				const lecture = await getLecture(lectureId);
				socket.emit('update-lecture', {
					lecture: lecture,
				});
				fs.writeFileSync('uploads/data.json', JSON.stringify(table));
				await upload(
					'uploads/data.json',
					`${lecture.batchId?._id}/${lecture._id}/${lecture._id}.json`,
				);
				await deleteCache(`${user?._id}:lectures*`);
				resolve(filteredTable);
			};
			if (JobId) ocr(JobId);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
interface GetTableOptionsProps {
	columnsName?: string[];
	headColumn?: number;
}
const getTable = (
	data: GetDocumentAnalysisCommandOutput,
	options?: GetTableOptionsProps,
) => {
	if (!data.Blocks) return console.log('No Blocks Found');
	const block = data.Blocks;
	const config = {
		headColumn: 0,
		columnsName:'All',
		...options,
	};
	const table: any[][] = [];

	block
		.filter((b) => b.BlockType === 'TABLE')
		.forEach((b) => {
			const cells = b.Relationships?.[0].Ids?.map((id) =>
				block.find((b) => b.Id === id),
			);
			if (!cells) return;
			cells.forEach((cell) => {
				if (!cell || !cell.RowIndex || !cell.ColumnIndex) return;
				table[cell.RowIndex - 1] = table[cell.RowIndex - 1] || [];

				let text = '';
				if (cell.Relationships)
					cell.Relationships[0].Ids?.forEach((id) => {
						if (text) text += ' ';
						text += block.filter((b) => b.Id === id)[0]?.Text;
					});
				table[cell.RowIndex - 1][cell.ColumnIndex - 1] = {
					...cell,
					text,
					children: cell.Relationships?.[0].Ids?.map((id) =>
						block.find((b) => b.Id === id),
					)?.map((cell) => cell),
				};
			});
		});
	const indexs = table[options?.headColumn || 0].map((row, index) => {
		const text = row.text;
		
		if (!text) return;
		if(config.columnsName === 'All') return row.ColumnIndex;
		if (typeof config.columnsName !== 'string' &&
			config.columnsName.find((v) =>
				text.toLowerCase().includes(v.toLowerCase()),
			)
		)
			return row.ColumnIndex;
	}).filter((v) => v !== undefined);

	return table.map((row) => {
		return row.filter((cell) => {
			if (indexs.includes(cell.ColumnIndex)) return cell;
		});
	});
};
