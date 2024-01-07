import prisma from "../libs/prisma";
import {faker} from "@faker-js/faker";
import {hashPassword} from "../src/utils/password.util";

const seed = async () => {
	const hashedPassword = await hashPassword("secret");
	const employeeName = {
		lastName: faker.person.lastName(),
		firstName: faker.person.firstName(),
		middleName: faker.person.middleName(),
	};

	// seeds
	const newCompany = await prisma.company.create({
		data: {
			uuid: faker.string.uuid(),
			name: faker.company.name(),
			jobTitles: faker.person.jobTitle(),
			departments: faker.commerce.department(),
			talentSegments: "none",
			employmentTypes: "regular",
			benefits: "none",
			User: {
				create: {
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					uuid: faker.string.uuid(),
					email: faker.internet.email(),
					password: hashedPassword,
				},
			},
		},
	});

	const newEmployee = await prisma.employee.create({
		data: {
			uuid: faker.string.uuid(),
			...employeeName,
			fullName: `${employeeName.lastName} ${employeeName.firstName} ${employeeName.middleName}`,
			nickname: faker.internet.userName(),
			suffix: faker.person.suffix(),
			phoneNumber: faker.phone.number(),
			email: faker.internet.email(),
			birthday: faker.date.birthdate({min: 18, max: 60, mode: "age"}),
			bloodType: "a+",
			salary: faker.finance.amount(),
			driverLicense: faker.number.int({min: 100000, max: 999999}).toString(),
			taxId: faker.number.int({min: 100000, max: 999999}).toString(),
			Company: {
				connect: {id: newCompany.id},
			},
		},
	});

	const newBankAccount = await prisma.bankAccount.create({
		data: {
			bankName: "metro bank",
			accountNumber: faker.finance.accountNumber(),
			cardNumber: faker.finance.creditCardNumber(),
			accountType: "debit",
			Company: {
				connect: {id: newCompany.id},
			},
			Employee: {
				connect: {id: newEmployee.id},
			},
		},
	});

	const newEmploymentHistory = await prisma.employmentHistory.create({
		data: {
			onBoarding: faker.date.recent({days: 10}),
			offBoarding: faker.date.future({years: 10}),
			reason: "termination",
			Company: {
				connect: {id: newCompany.id},
			},
			Employee: {
				connect: {id: newEmployee.id},
			},
		},
	});

	console.log({
		newCompany,
		newEmployee,
		newBankAccount,
		newEmploymentHistory,
	});
};

seed();
