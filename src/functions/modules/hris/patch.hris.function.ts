import {formatISO} from "date-fns";
import prisma from "../../../../libs/prisma";
import {generateUuid} from "../../../utils/uuid.util";
import {bankAccountType} from "../../../../types/modules/hris/payroll";
import {Prisma} from "@prisma/client";
import {userAuthCredentialsType} from "../../../../types/jwt-payload";
import {selectedEmployeeType} from "../../../../types/modules/hris/selected-employee";

export const updateEmployeeEmploymentStatus = async (
	company: userAuthCredentialsType["company"],
	selectedEmployee: selectedEmployeeType,
	body: Prisma.EmploymentHistoryCreateInput,
) => {
	if (selectedEmployee.isActive) {
		const newOffBoardedEmployee = await prisma.employee.update({
			where: {uuid: selectedEmployee.uuid},
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
					...body,
					uuid: await generateUuid(),
					onBoarding: newOffBoardedEmployee.hiredDate,
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
		return {status: 404, data: "employee is not currently employed"};
	}
};

export const applyBankAccountToEmployee = async (
	company: userAuthCredentialsType["company"],
	selectedEmployee: selectedEmployeeType,
	body: bankAccountType,
) => {
	if (selectedEmployee.isActive) {
		await prisma.employee.update({
			where: {uuid: selectedEmployee.uuid},
			data: {
				payType: "atm",
			},
		});
		await prisma.bankAccount.create({
			data: {
				uuid: await generateUuid(),
				...body,
				Employee: {
					connect: {
						id: selectedEmployee.id,
					},
				},
				Company: {
					connect: {id: company.id},
				},
			},
		});
		return {status: 200, data: "success"};
	} else {
		return {status: 404, data: "employee is not currently employed"};
	}
};

export const updateEmployeeData = async (
	selectedEmployee: selectedEmployeeType,
	body: Prisma.EmployeeUpdateInput,
) => {
	const updatedEmployee = await prisma.employee.update({
		where: {uuid: selectedEmployee.uuid},
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

export const reassignEmployeeIS = async (
	selectedEmployee: selectedEmployeeType,
	selectedEmployeeForIs: selectedEmployeeType,
) => {
	const updatedEmployee = await prisma.employee.update({
		where: {uuid: selectedEmployee.uuid},
		data: {
			ReportingTo: {
				connect: {id: selectedEmployeeForIs.id},
			},
		},
	});
	return {status: 200, data: updatedEmployee};
};
