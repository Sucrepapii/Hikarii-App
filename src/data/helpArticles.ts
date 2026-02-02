export interface Article {
  id: string;
  title: string;
  slug: string;
  category: "Getting Started" | "Account & Billing" | "Troubleshooting";
  content: string; // HTML or Markdown string
  excerpt: string;
}

export const helpArticles: Article[] = [
  // Getting Started
  {
    id: "1",
    title: "Setting up your workspace",
    slug: "setting-up-workspace",
    category: "Getting Started",
    excerpt:
      "Learn how to customize your dashboard and organize your first project.",
    content: `
            <h2>Welcome to your new Workspace</h2>
            <p>Your workspace is the command center for your life. Here's how to get it set up for maximum focus.</p>
            <h3>1. Create a Project</h3>
            <p>Projects act as containers for your tasks. Go to the "Projects" tab and click "New Project". Give it a name like "Personal Finance" or "Q3 Goals".</p>
            <h3>2. Add your first Task</h3>
            <p>Inside a project, simple type in the input field to add tasks. Press Enter to save.</p>
            <h3>3. Customize your View</h3>
            <p>You can toggle between List and Board views using the icons in the top right corner.</p>
        `,
  },
  {
    id: "2",
    title: "Importing data from other tools",
    slug: "importing-data",
    category: "Getting Started",
    excerpt:
      "Bring your tasks and budgets over from Todoist, Notion, or Excel.",
    content: `
            <h2>Moving in?</h2>
            <p>We make it easy to bring your data with you. Currently, we support CSV imports for tasks and basic budget items.</p>
            <p>Go to <strong>Settings > Import/Export</strong> to upload your CSV file. Make sure your columns match our template.</p>
        `,
  },
  {
    id: "3",
    title: "Understanding the Dashboard",
    slug: "understanding-dashboard",
    category: "Getting Started",
    excerpt: "A quick tour of the widgets and metrics on your home screen.",
    content: `
            <h2>Your Dashboard at a Glance</h2>
            <p>The dashboard aggregates data from all your active projects and budgets.</p>
            <ul>
                <li><strong>Net Worth:</strong> Real-time calculation of your assets minus liabilities.</li>
                <li><strong>Task Velocity:</strong> How many tasks you're completing per week.</li>
                <li><strong>Upcoming:</strong> A combined view of calendar events and due tasks.</li>
            </ul>
        `,
  },

  // Account & Billing
  {
    id: "4",
    title: "Managing your subscription",
    slug: "managing-subscription",
    category: "Account & Billing",
    excerpt: "Upgrade, downgrade, or cancel your plan at any time.",
    content: `
            <h2>Plan Management</h2>
            <p>You can manage your billing details in <strong>Settings > Billing</strong>.</p>
            <p>To upgrade to Pro, click "Upgrade" and follow the Stripe checkout flow. You'll get instant access to unlimited projects and AI insights.</p>
            <p>To cancel, scroll to the bottom of the Billing page. Your access will continue until the end of the current billing cycle.</p>
        `,
  },
  {
    id: "5",
    title: "Updating payment methods",
    slug: "updating-payment-methods",
    category: "Account & Billing",
    excerpt: "Add new cards or remove old ones securely.",
    content: `
            <h2>Payment Methods</h2>
            <p>We use Stripe to securely store your payment options. We never see your full card number.</p>
            <p>Navigate to Settings > Billing and locate the "Payment Methods" section to add a new card or make one default.</p>
        `,
  },

  // Troubleshooting
  {
    id: "6",
    title: "Why isn't my calendar syncing?",
    slug: "calendar-sync-issues",
    category: "Troubleshooting",
    excerpt: "Common reasons for sync delays and how to fix them.",
    content: `
            <h2>Calendar Sync Troubleshooting</h2>
            <p>If your Google Calendar events aren't showing up:</p>
            <ol>
                <li>Check your internet connection.</li>
                <li>Go to Settings > Integrations and ensure "Google Calendar" is connected.</li>
                <li>Try clicking "Force Sync" in the top right corner of the Calendar page.</li>
            </ol>
            <p>If issues persist, try disconnecting and reconnecting the integration.</p>
        `,
  },
  {
    id: "7",
    title: "Recovering deleted tasks",
    slug: "recovering-deleted-tasks",
    category: "Troubleshooting",
    excerpt: "Restoring items from the trash bin.",
    content: `
            <h2>Oops, didn't mean to delete that?</h2>
            <p>Deleted tasks are moved to the Trash, accessible from the bottom of the sidebar. Items in Trash are permanently deleted after 30 days.</p>
            <p>To restore a task, find it in the Trash view and click the "Restore" icon.</p>
        `,
  },
  {
    id: "8",
    title: "Resetting your password",
    slug: "resetting-password",
    category: "Troubleshooting",
    excerpt: "What to do if you get locked out of your account.",
    content: `
            <h2>Forgot Password?</h2>
            <p>If you can't log in, click "Forgot Password" on the login screen. We'll send a secure link to your email address.</p>
            <p>Note: The link expires in 15 minutes for security reasons.</p>
        `,
  },
  {
    id: "9",
    title: "Mobile App Basics",
    slug: "mobile-app-basics",
    category: "Getting Started",
    excerpt: "Take your tasks on the go with our iOS and Android apps.",
    content: `
            <h2>Hikari on Mobile</h2>
            <p>Stay productive wherever you are. Our mobile app supports offline mode, quick capture, and push notifications.</p>
            <p>Download it from the App Store or Google Play Store today.</p>
        `,
  },
  {
    id: "10",
    title: "Viewing Past Invoices",
    slug: "viewing-invoices",
    category: "Account & Billing",
    excerpt: "Access and download your billing history.",
    content: `
            <h2>Where are my invoices?</h2>
            <p>You can find all your past invoices in <strong>Settings > Billing > Invoice History</strong>.</p>
            <p>Click the download icon next to any invoice to save it as a PDF for your records.</p>
        `,
  },
  {
    id: "11",
    title: "Exporting Data",
    slug: "exporting-data",
    category: "Troubleshooting",
    excerpt: "How to download a backup of your workspace data.",
    content: `
            <h2>Data Export</h2>
            <p>You own your data. To export everything, go to <strong>Settings > Import/Export</strong> and click "Export All Data".</p>
            <p>You will receive a JSON file containing all your projects, tasks, and budget items.</p>
        `,
  },
];
