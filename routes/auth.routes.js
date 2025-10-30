import { Router } from "express";
import { body } from "express-validator";

import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  [
    body("name").trim().isLength({ min: 2, max: 50 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  signUp,
);

authRouter.post(
  "/sign-in",
  [body("email").isEmail(), body("password").exists()],
  signIn,
);

// Path: /api/v1/auth/sign-out (POST)
authRouter.post("/sign-out", signOut);

export default authRouter;
