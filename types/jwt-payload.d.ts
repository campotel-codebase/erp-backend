export type jwtPayloadType = {
	companyUuid: string;
	userUuid: string;
};

export type authCredentialsType = {
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
