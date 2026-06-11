import nodemailer from 'nodemailer';
import { PASSWORD_EMAILER, USER_EMAILER } from '../config/main.config';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAILER as string,
    pass: PASSWORD_EMAILER as string,
  },
});

if (!USER_EMAILER || !PASSWORD_EMAILER) {
  console.warn("❌ Transporter initialized with missing credentials. Email sending will fail.");
}

export default transporter; 