import { Response } from 'express';

export interface CreateResponseProps {
	status: 200 | 201 | 400 | 401 | 403 | 404 | 409 | 500;
	data?: any;
	message?: string;
}
export interface SendResponseProps extends CreateResponseProps {
	res: Response;
}
export const createResponse = ({
	status,
	data = null,
	message,
}: CreateResponseProps) => {
	switch (status) {
		case 200:
			return {
				isSuccess: true,
				message: message || 'Action Successful',
				data,
			};
		case 201: {
			return {
				isSuccess: true,
				message: message || 'Created Successfully',
				data,
			};
		}
		case 400: {
			return {
				isSuccess: false,
				message: message || 'Bad Request',
				data,
			};
		}
		case 401: {
			return {
				isSuccess: false,
				message: message || 'Authentication Failed',
				data,
			};
		}
		case 403: {
			return {
				isSuccess: false,
				message: message || 'Forbidden',
				data,
			};
		}
		case 404: {
			return {
				isSuccess: false,
				message: message || 'Not Found',
				data,
			};
		}
		case 409: {
			return {
				isSuccess: false,
				message: message || 'Conflict',
				data,
			};
		}
		case 500: {
			return {
				isSuccess: false,
				message: message || 'Internal Server Error',
				data,
			};
		}
		default:
	}
};
export const sendResponse = ({
	res,
	data,
	status,
	message,
}: SendResponseProps) => {
	return res.status(status).send(
		createResponse({
			status: status,
			data: data || {},
			message: message,
		}),
	);
};
