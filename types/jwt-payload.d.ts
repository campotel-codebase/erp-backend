export type jwtPayloadType = {
	companyUuid: string;
	userUuid: string;
};

export type authCredentialsType = {
	company: {
		id: number;
		uuid: string;
	};
	user: {
		id: number;
		uuid: string;
	};
};
