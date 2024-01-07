declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			EXPRESS_PORT: string;
			AUTH_KEY: string;
			AUTH_EXPIRATION: string;
		}
	}
}

export {};
