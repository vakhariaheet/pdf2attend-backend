import { RequestFile, RequestUser } from './types';

declare module 'socket.io' {
  interface Socket {
    user?: RequestUser;
  }
}
declare global {
	declare namespace Express {
		export interface Request {
			user?: RequestUser;
			file?: RequestFile;
		}
  }
  
  declare module NodeJS {
    interface Global {
      __basedir: string;
    }
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      DB_URL: string;
      JWT_SECRET: string;
    }
  }
}
