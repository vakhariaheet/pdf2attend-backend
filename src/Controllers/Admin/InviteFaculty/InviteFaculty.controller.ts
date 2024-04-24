import { Request, Response } from 'express';
import User from '../../../Models/User';
import { sendResponse } from '../../../utils/Response';
import { hash } from '../../../Service/Encryption';
import JWT from '../../../Service/JWT';
import { getLogger } from '../../../utils/Logger';
import { SendEmail, templates } from '@/Service/SendEmail';

const InviteFaculty = async (req: Request, res: Response) => {
	try {
		const { username, name, role="faculty", email } = req.body;
		
		const user = await User.create({
			username,
			name,
			isNew: true,
            role,
            email
		});
		const token = JWT.sign({
			id: user._id,
			iat: Date.now(),
			exp : Date.now() + 1000 * 60 * 60 * 24 * 7,
		}, process.env.JWT_SECRET as string);
		
		await SendEmail({
			to: email,
			template: {
				name: name.split(' ')[ 0 ],
				id: templates.newUser,
				link:`${process.env.FRONTEND_URL}/auth/verify?token=${token}`
			}
		})
		return sendResponse({
			res,
			status: 201,
			message: 'User created successfully',
            data: {
              user,
            },
		});
	} catch (err: any) {
		if (err.code === 11000) { 
			return sendResponse({
				res,
				status: 409,
				message: 'Username already exists',
			});
		}
        console.log(err.message);
        const logger = getLogger();
        logger.error(err);
        return sendResponse({ res, status: 500, message: "Something went wrong" });
    }
};

export default InviteFaculty;
