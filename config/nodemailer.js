import nodemailer from "nodemailer";
import process from "process";

import { EMAIL_USER, EMAIL_PASSWORD } from "./env.js";

export const EMAIL_USER =
  process.env.EMAIL_USER || "noreply@subscriptiontracker.com";

// config/nodemailer.js
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});
