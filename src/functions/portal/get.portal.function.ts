import prisma from "../../../libs/prisma";

export const getLeaveRequest = async (leaveRequestUuid: string) => {
	// TODO needs  to ve secured
	const leaveRequest = await prisma.leaveRequest.findUnique({
		where: {uuid: leaveRequestUuid},
	});
	return {status: 200, data: leaveRequest};
};
