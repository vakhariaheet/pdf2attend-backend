import { MailDataRequired } from '@sendgrid/mail';
export interface EmailTemplates {
	newUser: 'd-f42d475def1f4d2e88cf957ec7a45aea';
}

export interface SendEmailProps extends MailDataRequired {
	to: string;
	template: NewUserTemplateData;
	attachments?: EmailAttachment[];
	onSuccessfulSend?: (data: ClientResponse) => void;
	onFailedSend?: (error: Error) => void;
}

export interface NewUserTemplateData {
	id: EmailTemplates['newUser'];
	name: string;
	link: string;
}

export interface EmailAttachment {
	filename: string;
	content: string;
}
