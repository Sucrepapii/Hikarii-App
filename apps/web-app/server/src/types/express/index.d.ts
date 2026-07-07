import { SubscriptionStatus } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      subscriptionStatus: SubscriptionStatus;
      stripeCustomerId?: string | null;
    }

    interface Request {
      user?: User;
    }
  }
}
