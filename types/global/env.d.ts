declare global {
	namespace NodeJS {
		interface ProcessEnv {
			HOST: string;
			DB_URL: string;
			DB_PORT: string
			DB_USER_PASSWORD: string
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

export { };
