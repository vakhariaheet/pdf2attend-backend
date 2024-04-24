import { getLogger } from "@/utils/Logger";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";


const Logger = (req: Request, res: Response, next: NextFunction) => {
	const logger = getLogger();
	logger.info(
		`${req.method} ${req.path} ${req.ip} ${req.headers['user-agent']}`,
	);
	switch (req.method) {
		case 'GET':
			console.log(
				chalk.green(req.method),
				chalk.blue(req.path),
				chalk.yellow(req.ip),
				chalk.magenta(req.headers['user-agent']),
			);
			break;
		case 'POST':
			console.log(
				chalk.cyan(req.method),
				chalk.blue(req.path),
				chalk.yellow(req.ip),
				chalk.magenta(req.headers['user-agent']),
			);
			break;
		case 'PUT':
			console.log(
				chalk.yellow(req.method),
				chalk.blue(req.path),
				chalk.yellow(req.ip),
				chalk.magenta(req.headers['user-agent']),
			);
			break;
		case 'DELETE':
			console.log(
				chalk.red(req.method),
				chalk.blue(req.path),
				chalk.yellow(req.ip),
				chalk.magenta(req.headers['user-agent']),
			);
			break;
		default:
			console.log(
				chalk.green(req.method),
				chalk.blue(req.path),
				chalk.yellow(req.ip),
				chalk.magenta(req.headers['user-agent']),
			);
	}
	next();
}

export default Logger;