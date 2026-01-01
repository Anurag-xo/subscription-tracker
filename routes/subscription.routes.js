import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Public route: Get all subscriptions (optional — usually not exposed in production)
// Consider removing or restricting this in production
subscriptionRouter.get("/", (req, res) =>
  res.status(405).json({ success: false, message: "Method not allowed" }),
);

// Protected: Get a single subscription by ID (user must own it)
subscriptionRouter.get("/:id", authorize, getSubscriptionById);

// Protected: Create new subscription (user must be authenticated)
subscriptionRouter.post("/", authorize, createSubscription);

// Protected: Update subscription (user must own it)
subscriptionRouter.put("/:id", authorize, updateSubscription);

// Protected: Delete subscription (user must own it)
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

// Protected: Get all subscriptions for a user (must be the same user)
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

// Protected: Cancel a subscription (user must own it)
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

// Protected: Get upcoming renewals (user must own it)
subscriptionRouter.get(
  "/:id/upcoming-renewals",
  authorize,
  getUpcomingRenewals,
);

export default subscriptionRouter;
