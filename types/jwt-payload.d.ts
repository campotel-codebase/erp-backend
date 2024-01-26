export type jwtPayloadType = {
	companyUuid: string;
	userUuid: string;
};

export type userAuthCredentialsType = {
	company: {
		id: number;
		uuid: string;
		name: string;
		benefits: string | null;
	};
	user: {
		id: number;
		uuid: string;
		avatar: string | null
	};
};

export type EmployeeAuthCredentialsType = {
	company: {
		id: number;
		uuid: string;
		name: string;
		benefits: string | null;
	};
	employee: {
		id: number;
		uuid: string;
		fullName: string | null;
		reportingTo:(() => {
			uuid: string;
			suffix: string;
			fullName: string | null;
			email: string;
		} | null);
	};
};