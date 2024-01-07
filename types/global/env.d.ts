declare global {
	namespace NodeJS {
		interface ProcessEnv {
			HOST: string;
			DATABASE_URL: string;
			EXPRESS_PORT: string;
			AUTH_KEY: string;
			AUTH_EXPIRATION: string;
			EMAIL_SERVICE: string;
			EMAIL_APP_PASSWORD: string;
			EMAIL_ACCOUNT: string;
			TIMEZONE: string;
			MAILDEV_WEB_PORT: string;
			MAILDEV_SMTP_PORT: string;
		}
	}
}

export {};
