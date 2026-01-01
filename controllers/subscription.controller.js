import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";
import dayjs from "dayjs";

// POST /api/v1/subscriptions
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = new Subscription({
      ...req.body,
      user: req.user._id,
    });

    await subscription.save();

    // Trigger reminder workflow
    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    // Save workflowRunId for future cancellation
    subscription.workflowRunId = workflowRunId;
    await subscription.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (e) {
    next(e);
  }
};

// GET /api/v1/subscriptions/user/:id
export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      const error = new Error("You are not authorized to access this data");
      error.statusCode = 403;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
};

// GET /api/v1/subscriptions/:id
export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

// PUT /api/v1/subscriptions/:id
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    // Update fields (only allowed fields — extend as needed)
    const allowedUpdates = [
      "name",
      "price",
      "currency",
      "frequency",
      "category",
      "paymentMethod",
      "startDate",
      "renewalDate",
      "status",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        subscription[field] = req.body[field];
      }
    });

    // If renewalDate is updated, cancel old workflow and start new one
    if (req.body.renewalDate && subscription.workflowRunId) {
      await workflowClient.cancel(subscription.workflowRunId);
      const { workflowRunId: newWorkflowId } = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: { subscriptionId: subscription._id },
        headers: { "content-type": "application/json" },
        retries: 0,
      });
      subscription.workflowRunId = newWorkflowId;
    }

    await subscription.save();
    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

// DELETE /api/v1/subscriptions/:id
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    // Cancel workflow if exists
    if (subscription.workflowRunId) {
      await workflowClient.cancel(subscription.workflowRunId);
    }

    await Subscription.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Subscription deleted successfully" });
  } catch (e) {
    next(e);
  }
};

// PUT /api/v1/subscriptions/:id/cancel
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    subscription.status = "cancelled";
    await subscription.save();

    if (subscription.workflowRunId) {
      await workflowClient.cancel(subscription.workflowRunId);
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

// GET /api/v1/subscriptions/:id/upcoming-renewals
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    if (subscription.status !== "active") {
      return res.status(200).json({
        success: true,
        data: {
          daysLeft: null,
          renewalDate: null,
          message: "Subscription is not active",
        },
      });
    }

    const now = dayjs();
    const renewalDate = dayjs(subscription.renewalDate);
    const daysLeft = Math.max(0, renewalDate.diff(now, "day"));

    res.status(200).json({
      success: true,
      data: {
        daysLeft,
        renewalDate: subscription.renewalDate,
        isActive: daysLeft >= 0 && subscription.status === "active",
      },
    });
  } catch (e) {
    next(e);
  }
};
