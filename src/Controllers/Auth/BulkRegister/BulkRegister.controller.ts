import User from '@/Models/User';
import SheetJS from '@/Service/SheetJS';
import { sendResponse } from '@/utils/Response';
import { Request, Response } from 'express';

const sheetValidate = (sheet: any) => {
	if (!sheet[0]) throw new Error('Invalid Sheet');
	if ('Name' in sheet[0] && 'Email' in sheet[0]) {
		return true;
	}
	throw new Error('Invalid Sheet');
};

const BulkRegister = async (req: Request, res: Response) => {
	try {
		const { file } = req;
		const userInfo = await SheetJS.readFile<{ Name: string; Email: string,Username?:string }>(
			file?.path as string,
			sheetValidate,
		);
		const users = (await Promise.all(
			userInfo.map(async (user) => {
				const usernameArr = user.Name.split(' ');
				const userFirstName = usernameArr[0].toLowerCase();
				const userLastName = usernameArr[usernameArr.length - 1].toLowerCase();
				const username = user.Username ||  `${userFirstName}.${userLastName}`;
				const password = null;
				const name = user.Name;
				const role = 'faculty';
				const userInDB = await User.findOne({
					email: user.Email,
				});
				if (userInDB) {
					return;
				}
				return {
					username,
					password,
					name,
					role,
					email: user.Email,
				};
			}),
		)).filter((user) => user);
		const insertedUsers = await User.insertMany(users);
		sendResponse({ res, status: 200, data: insertedUsers });
	} catch (error) {
		if (typeof error === 'object') {
			if (error)
				if ('message' in error && typeof error.message === 'string') {
					sendResponse({ res, status: 400, message: error.message });
				}
		}
	}
};

export default BulkRegister;
