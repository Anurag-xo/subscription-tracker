import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
export { EMAIL_USER };
