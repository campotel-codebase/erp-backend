import {formatISO} from "date-fns";
import prisma from "../../../libs/prisma";
import {employeeSignInType} from "../../../types/modules/hris/employees";
import {approvedByType} from "../../../types/portal/request";
import {emailContent} from "../../utils/email.util";
import {generateJwt} from "../../utils/jwt.util";
import {
	hashPassword,
	sendResetLinkForPwd,
	verifyHashedPassword,
	verifyResetUuidForPwd,
} from "../../utils/password.util";
import {generateUuid} from "../../utils/uuid.util";
import {Prisma} from "@prisma/client";
import {EmployeeAuthCredentialsType} from "../../../types/jwt-payload";

export const employeeSignIn = async (body: employeeSignInType) => {
	const employeeAccount = await prisma.employee.findUnique({
		where: {email: body.email},
		select: {uuid: true, password: true, isPortalOpen: true},
	});
	if (employeeAccount) {
		if (employeeAccount.isPortalOpen) {
			const isPasswordMatch = await verifyHashedPassword(employeeAccount.password, body.password);
			if (isPasswordMatch) {
				const employee = await prisma.employee.findUnique({
					where: {
						uuid: employeeAccount.uuid,
					},
					include: {Company: {select: {uuid: true}}},
				});
				if (employee) {
					const jwt = generateJwt({companyUuid: employee.Company.uuid, userUuid: employee.uuid});
					if (jwt) {
						return {status: 200, data: jwt};
					} else {
						return {status: 400, data: "fail to generate token"};
					}
				} else {
					return {status: 400, data: "fail to query employee"};
				}
			} else {
				return {status: 401, data: "incorrect password"};
			}
		} else {
			return {status: 403, data: "no access"};
		}
	} else {
		return {status: 404, data: "account not found"};
	}
};

export const employeePwdResetLink = async (email: string) => {
	const isExists = await prisma.employee.findUnique({
		where: {email},
		select: {uuid: true, isPortalOpen: true},
	});
	if (isExists) {
		if (isExists.isPortalOpen) {
			await sendResetLinkForPwd(email, "employee");
			return {status: 200, data: "password reset link was sent to your email address"};
		} else {
			return {status: 403, data: "no access"};
		}
	} else {
		return {status: 404, data: "email not found"};
	}
};

export const employeeResetPwd = async (body: {newPassword: string}, passwordResetUuid: string) => {
	const {newPassword} = body;
	const isVerify = await verifyResetUuidForPwd(passwordResetUuid);
	if (isVerify.result === true) {
		const hashedPassword = await hashPassword(newPassword);
		await prisma.employee.update({
			where: {email: isVerify.email},
			data: {password: hashedPassword},
			select: {uuid: true},
		});
		await prisma.passwordReset.delete({
			where: {uuid: passwordResetUuid},
			select: {uuid: true},
		});
		return {status: 200, data: "password reset successfully"};
	} else {
		return {status: 400, data: "fail to reset password"};
	}
};

export const makeLeaveRequest = async (
	body: Prisma.LeaveRequestCreateInput,
	employee: EmployeeAuthCredentialsType["employee"],
) => {
	const {uuid, Employee, from, to, resumeOn, approvedBy, isApprovalDefault, ...rest} = body;
	const customApproval = JSON.stringify(approvedBy);
	const prepData = {
		uuid: await generateUuid(),
		Employee: {
			connect: {id: employee.id},
		},
		from: formatISO(from),
		to: formatISO(to),
		resumeOn: formatISO(resumeOn),
	};

	if (isApprovalDefault === 0) {
		const employeesToApprove = await prisma.employee.findMany({
			where: {
				uuid: {
					in: JSON.parse(customApproval),
				},
			},
			select: {
				uuid: true,
				suffix: true,
				fullName: true,
				email: true,
			},
		});
		const tags: approvedByType[] = employeesToApprove.map((reportingTo) => {
			return {
				...reportingTo,
				status: "pending",
				date: null,
				reason: null,
			};
		});
		const newLeaveRequest = await prisma.leaveRequest.create({
			data: {
				approvedBy: JSON.stringify(tags),
				isApprovalDefault,
				...prepData,
				...rest,
			},
		});
		for (const reportingTo of tags) {
			const sendTo = {
				to: reportingTo.email,
				subject: "Leave request",
				text: {
					title: `Dear ${reportingTo.suffix} ${reportingTo.fullName}`,
					msg: `I ${employee.fullName} am requesting a leave for your approval: ${newLeaveRequest.uuid}`,
				},
				usedFor: "notification",
			};
			await emailContent(sendTo);
		}
		return {status: 200, data: newLeaveRequest};
	} else {
		const employeeReportingTo = employee.reportingTo();
		if (employeeReportingTo) {
			// default routing
			const tags: approvedByType[] = [
				{
					uuid: employeeReportingTo.uuid,
					suffix: employeeReportingTo.suffix,
					fullName: employeeReportingTo.fullName,
					email: employeeReportingTo.email,
					status: "pending",
					date: null,
					reason: null,
				},
			];
			const newLeaveRequest = await prisma.leaveRequest.create({
				data: {
					approvedBy: JSON.stringify(tags),
					...prepData,
					...rest,
				},
				select: {uuid: true},
			});
			const sendTo = {
				to: tags[0].email,
				subject: "Leave request",
				text: {
					title: `Dear ${tags[0].suffix} ${tags[0].fullName}`,
					msg: `i ${employee.fullName} is requesting a leave to your approval: ${newLeaveRequest.uuid}`,
				},
				usedFor: "notification",
			};
			await emailContent(sendTo);
			return {status: 200, data: "request has been sent successfully"};
		} else {
			return {status: 409, data: "default routing approval is only applicable if you have a IS"};
		}
	}
};
