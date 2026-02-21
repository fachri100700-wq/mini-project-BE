import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_TOKEN_SECRET_KEY = process.env.JWT_TOKEN_SECRET_KEY;
export const USER_EMAILER = process.env.USER_EMAILER;
export const PASSWORD_EMAILER = process.env.PASSWORD_EMAILER;
export const JWT_RESET_SECRET_KEY = process.env.JWT_RESET_SECRET_KEY;
export const EVENT_APP_URL = process.env.EVENT_APP_URL;