import {formatISO} from "date-fns";
import prisma from "../../../libs/prisma";
import {EmployeeAuthCredentialsType} from "../../../types/jwt-payload";
import {approvedByType} from "../../../types/portal/request";

export const updateLeaveRequestStatus = async (
	leaveRequestUuid: string,
	employee: EmployeeAuthCredentialsType["employee"],
	body: {status: string; reason: string | null},
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
