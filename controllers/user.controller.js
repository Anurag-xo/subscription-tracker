import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user._id.toString() !== userId.toString()) {
      const error = new Error("Not authorized to access this user");
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (req.user._id.toString() !== id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingUser) {
        const error = new Error("Email is already in use");
        error.statusCode = 409;
        throw error;
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    const subscriptions = await Subscription.find({
      user: id,
      status: "active",
      workflowRunId: { $exists: true, $ne: null },
    });

    await Promise.all(
      subscriptions.map((sub) =>
        workflowClient.cancel(sub.workflowRunId).catch(console.error),
      ),
    );

    await Subscription.deleteMany({ user: id });
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User account and all subscriptions deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
