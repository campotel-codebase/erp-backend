import {formatISO} from "date-fns";
import prisma from "../../../../libs/prisma";
import {offBoardType} from "../../../../types/modules/hris/employees";
import {generateUuid} from "../../../utils/uuid.util";
import {bankAccountType} from "../../../../types/modules/hris/payroll";
import {Prisma} from "@prisma/client";
import {userAuthCredentialsType} from "../../../../types/jwt-payload";

export const updateEmployeeEmploymentStatus = async (
	company: userAuthCredentialsType["company"],
	employeeUuid: string,
	body: offBoardType,
) => {
	const findEmployeeInCompany = await prisma.company.findUnique({
		where: {uuid: company.uuid},
		select: {
			id: true,
			Employee: {
				where: {uuid: employeeUuid, isActive: 1},
			},
		},
	});
	const employee = findEmployeeInCompany?.Employee[0];
	if (employee) {
		const newOffBoardedEmployee = await prisma.employee.update({
			where: {uuid: employee.uuid},
			data: {
				isPortalOpen: 0,
				isActive: 0,
			},
			select: {id: true, hiredDate: true},
		});
		await prisma.bankAccount.updateMany({
			where: {
				employeeId: newOffBoardedEmployee.id,
			},
			data: {
				isActive: 0,
			},
		});
		if (newOffBoardedEmployee.hiredDate) {
			await prisma.employmentHistory.create({
				data: {
					uuid: await generateUuid(),
					offBoarding: formatISO(body.offBoarding),
					onBoarding: newOffBoardedEmployee.hiredDate,
					reason: body.reason,
					remarks: body.remarks,
					Employee: {
						connect: {id: newOffBoardedEmployee.id},
					},
					Company: {
						connect: {id: company.id},
					},
				},
			});
			return {status: 200, data: "employee offboarded successfully"};
		} else {
			return {status: 400, data: "employee hired date is not define"};
		}
	} else {
		return {status: 404, data: "employee not found"};
	}
};

export const applyBankAccountToEmployee = async (
	company: userAuthCredentialsType["company"],
	employeeUuid: string,
	body: bankAccountType,
) => {
	const findEmployeeInCompany = await prisma.company.findUnique({
		where: {uuid: company.uuid},
		select: {
			Employee: {
				where: {uuid: employeeUuid, isActive: 1},
			},
		},
	});
	const employee = findEmployeeInCompany?.Employee[0];
	if (employee) {
		const newPayrollForEmployee = await prisma.employee.update({
			where: {uuid: employee.uuid},
			data: {
				payType: "atm",
			},
			select: {id: true, payType: true},
		});
		const assignBank = await prisma.bankAccount.create({
			data: {
				uuid: await generateUuid(),
				...body,
				Employee: {
					connect: {
						id: newPayrollForEmployee.id,
					},
				},
				Company: {
					connect: {id: company.id},
				},
			},
		});
		return {status: 200, data: {newPayrollForEmployee, assignBank}};
	} else {
		return {status: 400, data: "invalid request"};
	}
};

export const updateEmployeeData = async (
	company: userAuthCredentialsType["company"],
	employeeUuid: string,
	body: Prisma.EmployeeUpdateInput,
) => {
	const findEmployeeInCompany = await prisma.company.findUniqueOrThrow({
		where: {uuid: company.uuid},
		select: {
			Employee: {
				where: {
					uuid: employeeUuid,
				},
				select: {uuid: true},
			},
		},
	});
	const employee = findEmployeeInCompany?.Employee[0];
	const updatedEmployee = await prisma.employee.update({
		where: {uuid: employee.uuid},
		data: body,
	});
	return {status: 200, data: updatedEmployee};
};

export const updateEmploymentHistoryData = async (
	company: userAuthCredentialsType["company"],
	employmentHistoryUuid: string,
	body: Prisma.EmploymentHistoryUpdateInput,
) => {
	const {offBoarding, ...rest} = body;
	const findEmploymentHistoryInCompany = await prisma.company.findUniqueOrThrow({
		where: {uuid: company.uuid},
		select: {
			EmploymentHistory: {
				where: {
					uuid: employmentHistoryUuid,
				},
				select: {uuid: true},
			},
		},
	});
	const updatedEmploymentHistory = await prisma.employmentHistory.update({
		where: {uuid: findEmploymentHistoryInCompany.EmploymentHistory[0].uuid},
		data: {offBoarding: formatISO(offBoarding as Date), ...rest},
	});
	return {status: 200, data: updatedEmploymentHistory};
};

export const updateBankAccountData = async (
	company: userAuthCredentialsType["company"],
	bankAccountUuid: string,
	body: Prisma.BankAccountUpdateInput,
) => {
	const findBankAccountInCompany = await prisma.company.findUniqueOrThrow({
		where: {uuid: company.uuid},
		select: {
			BankAccount: {
				where: {
					uuid: bankAccountUuid,
				},
				select: {uuid: true},
			},
		},
	});
	const updatedBankAccount = await prisma.bankAccount.update({
		where: {uuid: findBankAccountInCompany.BankAccount[0].uuid},
		data: body,
	});
	return {status: 200, data: updatedBankAccount};
};
