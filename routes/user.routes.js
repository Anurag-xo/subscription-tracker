import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", (req, res) =>
  res.status(405).json({ success: false, message: "Method not allowed" }),
);

userRouter.get("/me", authorize, (req, res) => {
  req.params.id = req.user._id;
  return getUser(req, res);
});

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) =>
  res
    .status(405)
    .json({ success: false, message: "Use /auth/sign-up to create a user" }),
);

userRouter.put("/:id", authorize, updateUser);

userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;
