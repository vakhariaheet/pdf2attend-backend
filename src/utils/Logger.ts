import winston from "winston";
import chalk from "chalk";
import luxon from "luxon";
export const getLogger = () => { 
    const logger = winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: 'logs/logs.log',
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
            }),
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.printf((info) => {
                    
                        const { timestamp, level, message } = info;
                        
                        const ts = luxon.DateTime.fromISO(timestamp).toFormat('yyyy-MM-dd HH:mm:ss');
                        return `${chalk.gray(`[${ts}]`)} ${chalk.green(level)}: ${message}`;
                    }
                    ),
                ),
                    
            })
        ],

    });
    return logger;
}
