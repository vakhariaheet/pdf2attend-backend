import ExcelJS from 'exceljs';
import dotenv from 'dotenv';
dotenv.config();
interface IStudentRow {
	'Roll No': string;
	'Student Name': string;
	'Enrollment No.': string;
	'Present/Absent': string;
}

const createExel = async (data: IStudentRow[]): Promise<string> => {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Sheet1');
	worksheet.columns = [
		{ header: 'Roll No', key: 'Roll No' },
		{ header: 'Student Name', key: 'Student Name' },
		{ header: 'Enrollment No.', key: 'Enrollment No.' },
		{ header: 'Present/Absent', key: 'Present/Absent' },
	];
	worksheet.addRows(data);
	await workbook.xlsx.writeFile("uploads/test.xlsx");
	
	return process.env.API_URL+'/file/test.xlsx';
};



export default createExel;
