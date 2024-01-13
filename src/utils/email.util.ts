import mjml2html from "mjml";
import fs from "fs";
import path from "path";
import {transporter} from "../../configs/email.config";
import Handlebars from "handlebars";
import {sendToType} from "../../types/email";

const resetPasswordTemplate = path.join(__dirname, "../../mjml/reset-password.mjml");
const notificationTemplate = path.join(__dirname, "../../mjml/notification.mjml");

export const emailContent = async (sendTo: sendToType) => {
	const {to, subject, text, usedFor} = sendTo;
	const isFor = () => {
		if (usedFor === "notification") {
			return notificationTemplate;
		} else {
			return resetPasswordTemplate;
		}
	};
	const mjmlTemplate = fs.readFileSync(isFor(), "utf8");

	const template = Handlebars.compile(mjmlTemplate);
	const mjmlWithDynamicData = template({title: text.title, msg: text.msg});

	const {html} = mjml2html(mjmlWithDynamicData);

	const mailOptions = {
		from: process.env.EMAIL_ACCOUNT,
		to,
		subject,
		html,
	};
	return await transporter.sendMail(mailOptions);
};
