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
	};
};