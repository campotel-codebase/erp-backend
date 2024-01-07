import nodemailer from "nodemailer";

const env = {
	service: process.env.EMAIL_SERVICE,
	email: process.env.EMAIL_ACCOUNT,
	password: process.env.EMAIL_APP_PASSWORD,
	port: process.env.MAILDEV_SMTP_PORT,
	host: process.env.HOST,
};

const productionConfig = {
	service: env.service,
	auth: {
		user: env.email,
		pass: env.password,
	},
};

const developmentConfig = {
	host: env.host,
	port: parseInt(env.port),
};

export const transporter = nodemailer.createTransport(developmentConfig);
