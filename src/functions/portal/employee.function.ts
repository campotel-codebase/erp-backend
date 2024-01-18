import {Prisma} from "@prisma/client";
import prisma from "../../../libs/prisma";
import {employeeSignInType} from "../../../types/modules/hris/employees";
import {generateJwt} from "../../utils/jwt.util";
import {
	verifyHashedPassword,
	verifyResetUuidForPwd,
	sendResetLinkForPwd,
	hashPassword,
} from "../../utils/password.util";
import {EmployeeAuthCredentialsType} from "../../../types/jwt-payload";
import {generateUuid} from "../../utils/uuid.util";
import {formatISO} from "date-fns";
import {emailContent} from "../../utils/email.util";
import {approvedByType} from "../../../types/portal/request";

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
export const employeeResetPwd = async (body: {uuid: string; newPassword: string}) => {
	const {uuid, newPassword} = body;
	const isVerify = await verifyResetUuidForPwd(uuid);
	if (isVerify.result === true) {
		const hashedPassword = await hashPassword(newPassword);
		await prisma.employee.update({
			where: {email: isVerify.email},
			data: {password: hashedPassword},
			select: {uuid: true},
		});
		await prisma.passwordReset.delete({
			where: {uuid},
			select: {uuid: true},
		});
		return {status: 200, data: "password reset successfully"};
	} else {
		return {status: 400, data: "fail to reset password"};
	}
};

export const createLeaveRequest = async (
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
		tags.forEach(async (reportingTo) => {
			const sendTo = {
				to: reportingTo.email,
				subject: "Leave request",
				text: {
					title: `Dear ${reportingTo.suffix} ${reportingTo.fullName}`,
					msg: `i ${employee.fullName} is requesting a leave to your approval: ${newLeaveRequest.uuid}`,
				},
				usedFor: "notification",
			};
			await emailContent(sendTo);
		});
		return {status: 200, data: newLeaveRequest};
	} else {
		const employeeReportingTo = employee.reportingTo();
		if (employeeReportingTo) {
			// default routing
			const tags = {
				uuid: employeeReportingTo.uuid,
				suffix: employeeReportingTo.suffix,
				fullName: employeeReportingTo.fullName,
				email: employeeReportingTo.email,
				status: "pending",
				date: null,
				reason: null,
			};
			const newLeaveRequest = await prisma.leaveRequest.create({
				data: {
					approvedBy: JSON.stringify(tags),
					...prepData,
					...rest,
				},
				select: {uuid: true},
			});
			const sendTo = {
				to: tags.email,
				subject: "Leave request",
				text: {
					title: `Dear ${tags.suffix} ${tags.fullName}`,
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

export const viewLeaveRequest = async (leaveRequestUuid: string) => {
	// TODO needs  to ve secured
	const leaveRequest = await prisma.leaveRequest.findUnique({
		where: {uuid: leaveRequestUuid},
	});
	return {status: 200, data: leaveRequest};
};

export const validateLeaveRequest = async (
	leaveRequestUuid: string,
	employee: EmployeeAuthCredentialsType["employee"],
	body: {status: number; reason: string | null},
) => {
	const approvalList = await prisma.leaveRequest.findUnique({
		where: {uuid: leaveRequestUuid},
		select: {approvedBy: true},
	});
	if (approvalList) {
		const approvalArr: approvedByType[] = JSON.parse(approvalList.approvedBy);
		const approvedIt = approvalArr.map((employeeToApprove) => {
			const {uuid, status, date, reason, ...rest} = employeeToApprove;
			if (uuid === employee.uuid) {
				return {
					uuid,
					status: body.status,
					reason: body.reason,
					date: formatISO(new Date()),
					...rest,
				};
			}
			return employeeToApprove;
		});
		if (approvedIt.length !== 0) {
			const updateLeave = await prisma.leaveRequest.update({
				where: {uuid: leaveRequestUuid},
				data: {approvedBy: JSON.stringify(approvedIt)},
			});
			return {status: 200, data: updateLeave};
		} else {
			return {status: 204, data: "approval list cant be null"};
		}
	} else {
		return {status: 404, data: "leave request not found"};
	}
};
