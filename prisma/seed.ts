import prisma from "../libs/prisma";
import {faker} from "@faker-js/faker";
import {hashPassword} from "../src/utils/password.util";

const seed = async () => {
	const hashedPassword = await hashPassword("secret");

	// seeds
	const newCompany = await prisma.company.create({
		data: {
			uuid: faker.string.uuid(),
			name: "campotel",
			benefits: JSON.stringify(["sss", "pagIbig"]),
			User: {
				create: {
					lastName: faker.person.lastName(),
					firstName: faker.person.firstName(),
					uuid: faker.string.uuid(),
					email: "campo@example.com",
					password: hashedPassword,
				},
			},
		},
	});

	const newEmployees = await prisma.employee.createMany({
		data: Array.from({length: 40}).map(() => {
			const employeeName = {
				lastName: faker.person.lastName(),
				firstName: faker.person.firstName(),
				middleName: faker.person.middleName(),
			};
			return {
				companyId: newCompany.id,
				uuid: faker.string.uuid(),
				...employeeName,
				fullName: `${employeeName.lastName} ${employeeName.firstName} ${employeeName.middleName}`,
				nickname: faker.internet.userName(),
				suffix: faker.person.suffix(),
				phoneNumber: faker.phone.number(),
				email: faker.internet.email(),
				password: hashedPassword,
				birthday: faker.date.birthdate({min: 18, max: 60, mode: "age"}),
				bloodType: "a+",
				salary: faker.finance.amount(),
				driverLicense: faker.number.int({min: 100000, max: 999999}).toString(),
				taxId: faker.number.int({min: 100000, max: 999999}).toString(),
				hiredDate: faker.date.recent(),
			};
		}),
	});

	console.log({
		newCompany,
		newEmployees,
	});
};

seed();
