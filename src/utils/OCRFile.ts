import {
	StartDocumentAnalysisCommand,
	GetDocumentAnalysisCommand,
	TextractClient,
} from '@aws-sdk/client-textract';
import dotenv from 'dotenv';
import fs from 'fs';
import { Socket } from 'socket.io';
const client = new TextractClient({ region: 'ap-south-1' });
import { setTimeoutAsync } from './utils';
dotenv.config();
export const scanFile = async (name: string, socket: Socket):Promise<any[][][]> =>
	new Promise(async (resolve, reject) => {
		const command = new StartDocumentAnalysisCommand({
			DocumentLocation: {
				S3Object: {
					Bucket: process.env.AWS_BUCKET,
					Name: name,
				},
			},
			FeatureTypes: ['TABLES'],
		});

		try {
			const data = await client.send(command);
			const JobId = data.JobId;
			const table:any[][][]=[]
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
				const block = detextData.Blocks;
				if (!block)
					return socket.emit('log', {
						data: 'No blocks found in the document. Try again.',
					});
				const cells = block
					.filter((b) => b.BlockType === 'CELL')
					.map((b) => {
						const children = b.Relationships?.[ 0 ].Ids?.map((id) =>
							block.find((b) => b.Id === id)
						);
						if (b.EntityTypes && b.EntityTypes[0] === 'COLUMN_HEADER')
							return {
								BoundingBox: b.Geometry?.BoundingBox,
								Polygon: b.Geometry?.Polygon,
								ColumnIndex: b.ColumnIndex,
								RowIndex: b.RowIndex,
								Page: b.Page,
								
							};
						let text = '';
						if (b.Relationships)
							b.Relationships[0].Ids?.forEach((id) => {
								if (text) text += ' ';
								text += block.filter((b) => b.Id === id)[0].Text;
							});
						return {
							BoundingBox: b.Geometry?.BoundingBox,
							ColumnIndex: b.ColumnIndex,
							Polygon: b.Geometry?.Polygon,
							RowIndex: b.RowIndex,
							Page: b.Page,
							Text: b.ColumnIndex !== 4 ? text : text ? 'PRESENT' : 'ABSENT',
							children,
						};
					});

				cells
					.sort((cell1, cell2) => {
						if (
							!cell1.ColumnIndex ||
							!cell2.ColumnIndex ||
							!cell1.RowIndex ||
							!cell2.RowIndex
						)
							return 0;
						return (
							cell1.RowIndex - cell2.RowIndex ||
							cell1.ColumnIndex - cell2.ColumnIndex
						);
					})
					.map((cell) => {
						if (!cell.ColumnIndex || !cell.RowIndex || !cell.Text || !cell.Page)
							return;
						else {
							table[cell.Page - 1] = table[cell.Page - 1] || [];
							table[cell.Page - 1][cell.RowIndex - 1] = table[cell.Page - 1][cell.RowIndex - 1] ||[];
							table[cell.Page - 1][cell.RowIndex - 1][cell.ColumnIndex - 1] =
								cell;
						}
					});
		
				socket.emit('log', {
					data: 'File Read Successfully',
				});
				if (detextData.NextToken) {
					ocr(JobId, detextData.NextToken);
					return;
				}

				resolve(table);
			};
			if (JobId) ocr(JobId);
		} catch (err) {
			console.log(err);
		}
	});
