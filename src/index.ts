import http from 'http';
import Express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import multer from 'multer';
import rimraf from 'rimraf';

import { upload as uploadToS3 } from './utils/UploadS3';
import { scanFile } from './utils/OCRFile';
import createExel from './utils/createExel';
// Routes
import Auth from './Route/Auth';
import Student from './Route/Student';
import Subject from './Route/Subject';
import Lecture from './Route/Lecture';
import Admin from './Route/Admin';
import connectMongoose from './utils/connectMongoose';
import Logger from './Middleware/Logger';
import { parseCookieString } from './utils/Cookie';
import JWT from './Service/JWT';
import { getLogger } from './utils/Logger';
import { VerifyTokenSocket } from './Middleware/VerifyToken';
import { RequestUser } from './types';
const app = Express();
dotenv.config();
app.use(
	cors({
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		origin: 'http://localhost:5173',
	}),
);
app.use(Express.urlencoded({ extended: true }));
app.use(
	Express.json({
		limit: '50mb',
	}),
);
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	},
	async allowRequest(req, fn) {
		try {
			const cookies = parseCookieString(req.headers.cookie || '');
			if (!cookies) return fn('Unauthorized', false);
			if (!cookies.accessToken || !cookies.refreshToken)
				return fn('Unauthorized', false);
			const isTokenValid = await JWT.verify(
				cookies.accessToken,
				process.env.JWT_SECRET,
			);
			if (!isTokenValid) return fn('Unauthorized', false);
			fn(null, true);
		} catch (err: any) {
			const logger = getLogger();
			logger.error(err.toString());
			fn('Internal Server', false);
		}
	},
});

const upload = multer({ dest: 'uploads/' });
app.use(Logger);
app.use('/auth', Auth);
app.use('/student', Student);
app.use('/subject', Subject);
app.use('/lecture', Lecture);
app.use('/admin',Admin)
io.use(VerifyTokenSocket);
io.on('connection', (socket) => {
	console.log('New client connected', socket.user?.name);
	socket.on('init', async (data) => {
		const { name, lectureId } = data;
		if (!name) return socket.emit('error', 'No URL provided');
		const result = await scanFile({
			fileName: name,
			socket,
			lectureId,
			user: socket.user as RequestUser,
		});
		const filteredResult = result
			
		console.log('Emited Result');
		socket.emit('result', filteredResult);
	});
	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});
app.post(
	'/upload',
	upload.single('file'),
	async (req: Request, res: Response) => {
		const file = req.file;
		if (!file) {
			res.status(400).send('No file uploaded.');
			return;
		}
		const url = await uploadToS3(file.path, file.filename);
		await rimraf(file.path);
		res.status(200).json({
			url,
			name: file.filename,
		});
	},
);
app.post('/create-xlsx', async (req: Request, res: Response) => {
	const { data } = req.body;
	if (!data) {
		res.status(400).send('No data provided');
		return;
	}
	try {
		const result = await createExel(data);
		res.status(200).json({
			s3: result,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Something went wrong');
	}
});
app.get('/file/:fileName', async (req: Request, res: Response) => {
	const { fileName } = req.params;
	if (!fileName) {
		res.status(400).send('No file name provided');
		return;
	}
	res.download(`uploads/${fileName}`);
	await rimraf(`uploads/${fileName}`);
});
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});
const PORT = process.env.PORT || 3006;
(async () => {
	await connectMongoose();
})();

server.listen(PORT, () => {
	console.log('Server is running on port', PORT);
});
console.log(crypto.randomUUID());
