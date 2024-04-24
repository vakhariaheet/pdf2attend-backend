import * as XLSX from 'xlsx';

class SheetJS {
	static readFile = async <T>(file: string, validator?:(data:unknown[])=>void,sheetName?: string,) => {
		const workbook =await XLSX.readFile(file, {
			dateNF: 'dd/mm/yyyy',
			sheets: sheetName ? [sheetName] : undefined,
			cellDates: true,
			type: 'file',
		});
		const sheet_name_list = workbook.SheetNames;
		const xlData =await XLSX.utils.sheet_to_json<T>(
			workbook.Sheets[sheet_name_list[0]],
        );
        if (validator) { 
            await validator(xlData);
        }
		return xlData;
	};
}


export default SheetJS;