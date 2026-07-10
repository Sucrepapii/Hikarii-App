export interface PlanFeature {
  name: string;
  description?: string;
  available: {
    free: boolean;
    pro: boolean;
  };
}

export interface PricingPlan {
  id: "free" | "pro";
  name: string;
  displayName: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  highlighted?: boolean;
}

// Core feature definitions with availability by plan
export const PLAN_FEATURES: PlanFeature[] = [
  {
    name: "Unlimited Tasks",
    description: "Create as many tasks as you need",
    available: { free: true, pro: true },
  },
  {
    name: "1 Active Project",
    description: "Focus on one project at a time",
    available: { free: true, pro: false },
  },
  {
    name: "Basic Analytics",
    description: "View basic charts and insights",
    available: { free: true, pro: false },
  },
  {
    name: "Unlimited Projects",
    description: "Manage unlimited active projects",
    available: { free: false, pro: true },
  },
  {
    name: "Task-Expense Linking",
    description: "Link tasks to budget items for complete visibility",
    available: { free: false, pro: true },
  },
  {
    name: "AI Insights",
    description: "Predictive analytics and intelligent recommendations",
    available: { free: false, pro: true },
  },
  {
    name: "Advanced Analytics",
    description: "Detailed reports, trends, and forecasting",
    available: { free: false, pro: true },
  },
  {
    name: "Advanced Reporting & Exports",
    description: "Professional CSV/PDF reports for tax and accounting",
    available: { free: false, pro: true },
  },
  {
    name: "Priority Support",
    description: "Get help faster with priority email support",
    available: { free: false, pro: true },
  },
  {
    name: "Context-Aware Task Splitting",
    description:
      "Break large tasks into manageable calendar blocks contextually",
    available: { free: false, pro: true },
  },
];

// Pricing plans configuration
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    displayName: "Free",
    price: 0,
    billingPeriod: "month",
    description: "Essential tools for personal tasks.",
    features: PLAN_FEATURES.filter((f) => f.available.free).map((f) => f.name),
  },
  {
    id: "pro",
    name: "Pro",
    displayName: "Hikarii Pro",
    price: 8.99,
    billingPeriod: "month",
    description: "Advanced insights & limitless potential.",
    features: [
      "Everything in Free",
      ...PLAN_FEATURES.filter((f) => f.available.pro && !f.available.free).map(
        (f) => f.name,
      ),
    ],
    highlighted: true,
  },
];

// Helper functions
export const getFeaturesByPlan = (planId: "free" | "pro"): PlanFeature[] => {
  return PLAN_FEATURES.filter((f) => f.available[planId]);
};

export const isFeatureAvailable = (
  featureName: string,
  planId: "free" | "pro",
): boolean => {
  const feature = PLAN_FEATURES.find((f) => f.name === featureName);
  return feature ? feature.available[planId] : false;
};

export const getPlanById = (
  planId: "free" | "pro",
): PricingPlan | undefined => {
  return PRICING_PLANS.find((p) => p.id === planId);
};

// Premium feature details for landing page
export const PREMIUM_FEATURES = [
  {
    name: "Task-Expense Linking",
    value: "See exactly what each project costs you",
    marketValue: "$5-7/month standalone",
    icon: "Link2",
  },
  {
    name: "Predictive Analytics & AI Insights",
    value: "AI that helps you save before you overspend",
    marketValue: "$3-5/month standalone",
    icon: "Zap",
  },
  {
    name: "Advanced Reporting & Exports",
    value: "Professional reports for tax, clients, or investors",
    marketValue: "$4-6/month standalone",
    icon: "FileText",
  },
];
