import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { EmailTemplates, SendEmailProps } from './types';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
export const templates: EmailTemplates = {
	newUser: 'd-f42d475def1f4d2e88cf957ec7a45aea',
};
export const SendEmail = async ({
	to,
	template,
	attachments,
	onSuccessfulSend,
}: SendEmailProps) => {
	const msg = {
		to: to,
		from: {
			email: 'hello@m.pdf2attend.xyz',
			name: 'PDF2Attend',
		},
		templateId: template.id,
		dynamic_template_data: template,
		attachments,
	};
	try {
		const data = await sgMail.send(msg);
		if (onSuccessfulSend) return onSuccessfulSend(data[0]);
	} catch (error: any) {
		throw new Error(error);
	}
};
