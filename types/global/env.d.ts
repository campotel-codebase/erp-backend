declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			EXPRESS_PORT: number;
			AUTH_KEY: string;
		}
	}
}

export {};
