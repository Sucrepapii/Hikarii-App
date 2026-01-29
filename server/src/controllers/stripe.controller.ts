import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover", // Use latest API version available
});

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

export const createCheckoutSession = async (req: Request, res: Response) => {
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

    const priceId = PRO_PRICE_ID;
    if (!priceId) {
      console.error(
        "Stripe Error: PRO_PRICE_ID is missing in environment variables",
      );
      return res
        .status(500)
        .json({ message: "Server configuration error: Missing Price ID" });
    }

    console.log("Stripe: Creating checkout session with Price ID:", priceId);

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
        trial_period_days: 14,
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

export const createPortalSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId)
      return res.status(400).json({ message: "No subscription found" });

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
