import { Request, Response } from 'express';
import User from '../../../Models/User';
import { sendResponse } from '../../../utils/Response';
import { compare } from '../../../Service/Encryption';
import JWT from '../../../Service/JWT';
import { getLogger } from '../../../utils/Logger';


const Login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user)
            return sendResponse({ res, status: 404, message: 'User not found' });
        if (!user.password)
            return sendResponse({ res, status: 401, message: 'Account setup is left' });
		const isPasswordVerified = await compare(password, user.password);
		if (!isPasswordVerified)
			return sendResponse({ res, status: 401, message: 'Invalid Credentials' });
		const data = {
			id: user._id,
            iat: Date.now(),
        };
        const accessTokenExpireTime = new Date(Date.now() + 3 * 60 * 60 * 1000).getTime();
        const refreshTokenExpireTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime()   ;
		const accessToken = JWT.sign({...data,exp:accessTokenExpireTime}, process.env.JWT_SECRET as string);
		const refreshToken = JWT.sign({...data,exp:refreshTokenExpireTime}, process.env.JWT_SECRET as string);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.pdf2attend.xyz' : undefined,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        res.cookie('accessToken', accessToken, {
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.pdf2attend.xyz' : undefined,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return sendResponse({
            res,
            status: 200,
            message: 'Login successful',
        });
    } catch (err) {
        console.log(err);
		const logger = getLogger();
		logger.error(err?.toString());
		return sendResponse({ res, status: 500, message: 'Something went wrong' });
	}
};

export default Login;