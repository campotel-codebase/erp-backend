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

	const newEmployees = await prisma.employee.createMany({
		data: Array.from({length: 4}).map(() => ({
			companyId: newCompany.id,
			uuid: faker.string.uuid(),
			...employeeName,
			fullName: `${employeeName.lastName} ${employeeName.firstName} ${employeeName.middleName}`,
			nickname: faker.internet.userName(),
			suffix: faker.person.suffix(),
			phoneNumber: faker.phone.number(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			birthday: faker.date.birthdate({min: 18, max: 60, mode: "age"}),
			bloodType: "a+",
			salary: faker.finance.amount(),
			driverLicense: faker.number.int({min: 100000, max: 999999}).toString(),
			taxId: faker.number.int({min: 100000, max: 999999}).toString(),
		})),
	});

	const newBankAccounts = await prisma.bankAccount.createMany({
		data: Array.from({length: 4}).map(() => ({
			uuid: faker.string.uuid(),
			companyId: newCompany.id,
			bankName: "metro bank",
			accountNumber: faker.finance.accountNumber(),
			cardNumber: faker.finance.creditCardNumber(),
			accountType: "debit",
		})),
	});

	console.log({
		newCompany,
		newEmployees,
		newBankAccounts,
	});
};

seed();
