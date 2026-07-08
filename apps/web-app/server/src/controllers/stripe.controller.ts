import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../config/db";

let stripe: Stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover", // Use latest API version available
  });
} else {
  console.warn("STRIPE_SECRET_KEY is missing. Stripe features will be disabled.");
}

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

export const createCheckoutSession = async (req: any, res: Response) => {
  console.log("Stripe: createCheckoutSession started");
  console.log(
    "Stripe: Env Check -> PRO_PRICE_ID:",
    process.env.STRIPE_PRO_PRICE_ID ? "Set" : "Missing",
  );

  try {
    const userId = req.user?.id;
    console.log("Stripe: User ID from req:", userId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!stripe) {
      console.error("Stripe is not configured on this server.");
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    // If user already has stripe customer ID, use it
    let customerId = user.stripeCustomerId;
    console.log("Stripe: Existing Customer ID:", customerId);

    // If not, create a new customer in Stripe
    if (!customerId) {
      console.log("Stripe: Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      console.log("Stripe: New Customer ID created:", customerId);

      // Update user with customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const { billingPeriod } = req.body;
    console.log("Stripe: Billing Period requested:", billingPeriod);

    let priceId = process.env.STRIPE_PRO_PRICE_ID; // Default to monthly

    if (billingPeriod === "yearly") {
      priceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;
      console.log("Stripe: Selected YEARLY price ID");
    } else {
      console.log("Stripe: Selected MONTHLY price ID");
    }

    if (!priceId) {
      console.error(
        `Stripe Error: Price ID for ${billingPeriod} is missing in environment variables`,
      );
      return res
        .status(500)
        .json({ message: "Server configuration error: Missing Price ID" });
    }

    console.log("Stripe: Creating checkout session with Price ID:", priceId);

    // Calculate trial period: 2 months (60 days) promo until June 2026, then 14 days
    const promoCutoff = new Date("2026-07-01");
    const now = new Date();
    const isPromoActive = now < promoCutoff;
    const trialDays = isPromoActive ? 60 : 14;

    console.log(
      `Stripe: Trial period set to ${trialDays} days (Promo active: ${isPromoActive})`,
    );

    const clientUrl = process.env.CLIENT_URL || "https://www.hikarii.org";
    console.log("Stripe: Using Client URL:", clientUrl);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: trialDays,
      },
      success_url: `${clientUrl}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/pricing`,
      metadata: {
        userId: userId,
      },
    });

    console.log("Stripe: Session created successfully:", session.id);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

export const createPortalSession = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId)
      return res.status(400).json({ message: "No subscription found" });

    if (!stripe) return res.status(500).json({ message: "Stripe not configured" });

    const clientUrl = process.env.CLIENT_URL || "https://www.hikarii.org";
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${clientUrl}/settings`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Portal Session Error:", error);
    res.status(500).json({ message: "Failed to create portal session" });
  }
};

export const cancelSubscription = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ message: "No active subscription found" });
    }

    if (!stripe) return res.status(500).json({ message: "Stripe not configured" });

    // List subscriptions to find the active one
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res
        .status(400)
        .json({ message: "No active subscription to cancel" });
    }

    const subscriptionId = subscriptions.data[0].id;

    // Update subscription to cancel at period end
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true },
    );

    // Update user record to reflect cancellation status immediately for UI
    // Assuming we might want to track this. If schema doesn't have it, this might fail unless I check schema.
    // For now, I'll return the status and let Frontend handle it.
    // Ideally, we should have a `cancelAtPeriodEnd` field on User.
    // I will check schema later if needed. For now, rely on Stripe return.

    res.json({
      message:
        "Subscription will be cancelled at the end of the billing period",
      currentPeriodEnd: new Date(
        (updatedSubscription as any).current_period_end * 1000,
      ),
    });
  } catch (error: any) {
    console.error("Cancel Subscription Error:", error);
    res
      .status(500)
      .json({ message: "Failed to cancel subscription", error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res.status(400).send("Missing signature or secret");
  }

  let event: Stripe.Event;

  try {
    // req.body must be raw buffer here
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSubscriptionCreated(session);
      break;
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSucceeded(invoice);
      break;
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) return;

  // We embedded userId in metadata during checkout creation
  const userId = session.metadata?.userId;
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "PRO",
      subscriptionId: session.subscription as string,
      stripeCustomerId: session.customer as string,
    },
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!(invoice as any).subscription) return;

  // Retrieve subscription to get period end
  // Cast to any to avoid type errors with mismatched Stripe types
  const subscription = await stripe.subscriptions.retrieve(
    (invoice as any).subscription as string,
  );

  // Find user by stripe customer id
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "PRO",
        currentPeriodEnd: new Date(
          (subscription as any).current_period_end * 1000,
        ),
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "FREE",
        currentPeriodEnd: null,
      },
    });
  }
}
