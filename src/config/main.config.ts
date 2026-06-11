import "dotenv/config";

// Diagnostic logging for Email Credentials
if (!process.env.USER_EMAILER || !process.env.PASSWORD_EMAILER) {
    console.warn("⚠️  Emailer credentials are missing in environment variables!");
} else {
    console.log("✅ Emailer credentials found for:", process.env.USER_EMAILER);
}

export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_TOKEN_SECRET_KEY = process.env.JWT_TOKEN_SECRET_KEY;
export const USER_EMAILER = process.env.USER_EMAILER;
export const PASSWORD_EMAILER = process.env.PASSWORD_EMAILER;
export const JWT_RESET_SECRET_KEY = process.env.JWT_RESET_SECRET_KEY;
export const EVENT_APP_URL = process.env.EVENT_APP_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;