export interface Article {
  id: string;
  title: string;
  slug: string;
  category:
    | "Getting Started"
    | "Account & Billing"
    | "Troubleshooting"
    | "Features & Integrations"
    | "The Hikari Method";
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
            <p>Coming soon...</p>
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
            <p>We use Stripe to securely process your payment options. We never see your full card number.</p>
            <p>Navigate to Settings > Subscription to manage your plan and billing.</p>
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
            <p>Deleted tasks are permanently deleted immediately.</p>
            <p>But don't worry, you can always recreate them.</p>
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
            <p>Coming soon...</p>
        `,
  },
  {
    id: "10",
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
  {
    id: "11",
    title: "Using AI Smart Split",
    slug: "using-ai-smart-split",
    category: "Getting Started",
    excerpt:
      "Let Hikari break down complex tasks into manageable steps for you.",
    content: `
        <h2>Work Smarter, Not Harder</h2>
        <p>Large tasks can be overwhelming. The <strong>AI Smart Split</strong> feature analyzes your task description and automatically generates a checklist of subtasks.</p>
        <h3>How to use it:</h3>
        <ol>
            <li>Create a new task or open an existing one.</li>
            <li>Click the <strong>✨ Wand Icon</strong> (Smart Split) next to the subtasks section.</li>
            <li>Wait a moment for the AI to analyze your task.</li>
            <li>Review the suggested subtasks and click <strong>Apply</strong> to add them to your task.</li>
        </ol>
        <p><em>Note: This feature requires a Pro subscription.</em></p>
    `,
  },
  {
    id: "12",
    title: "Data Security & Privacy",
    slug: "data-security-privacy",
    category: "Account & Billing",
    excerpt: "How we protect your personal information and financial data.",
    content: `
        <h2>Your Trust is Our Priority</h2>
        <p>We take security seriously. Here is how we ensure your data stays safe:</p>
        <ul>
            <li><strong>Encryption:</strong> All data is encrypted in transit (TLS) and at rest (AES-256).</li>
            <li><strong>Payments:</strong> We use Stripe for payment processing. We never store your credit card details on our servers.</li>
            <li><strong>Privacy:</strong> We do not sell your personal data to third parties.</li>
        </ul>
        <p>For more details, visit our <a href="/security">Security Page</a> and <a href="/privacy">Privacy Policy</a>.</p>
    `,
  },
  {
    id: "13",
    title: "Setting up WhatsApp Notifications",
    slug: "whatsapp-notifications",
    category: "Features & Integrations",
    excerpt: "Get real-time alerts on your phone for tasks and budgets.",
    content: `
        <h2>Stay Connected with WhatsApp</h2>
        <p>WhatsApp notifications keep you informed about your workspace even when you're away from your desk.</p>
        <h3>How to Enable:</h3>
        <ol>
            <li>Navigate to <strong>Settings > Profile</strong>.</li>
            <li>Enter your phone number in international format (e.g., +1234567890).</li>
            <li>Scroll down to "WhatsApp Notifications" and toggle the categories you want:
                <ul>
                    <li><strong>Overdue Tasks:</strong> Get a daily summary of tasks past their due date.</li>
                    <li><strong>Budget Alerts:</strong> Get an instant message the moment you exceed a budget limit.</li>
                    <li><strong>Project Deadlines:</strong> Stay informed about upcoming or passed project end dates.</li>
                </ul>
            </li>
            <li>Click <strong>Save Changes</strong>.</li>
        </ol>
        <p><em>Note: If you are using the Twilio Sandbox for testing, you must first join the sandbox on your phone by following the instructions in your Twilio console.</em></p>
    `,
  },
  {
    id: "14",
    title: "Budget Management 101",
    slug: "budget-management-basics",
    category: "Features & Integrations",
    excerpt: "Learn how to track spending and stay within your limits.",
    content: `
        <h2>Take Control of Your Spending</h2>
        <p>Hikari's budgeting tools help you visualize where your money is going and ensure you stay on track.</p>
        <h3>1. Create a Budget</h3>
        <p>Go to the <strong>Budget</strong> page and click "Create Budget". Choose a category (like Food or Utilities) and set a monthly limit.</p>
        <h3>2. Log Expenses</h3>
        <p>Every time you spend money, add an expense. You can link expenses to specific projects or even tasks to see the true cost of your work.</p>
        <h3>3. Real-time Tracking</h3>
        <p>The progress bars on your Budget page update instantly as you log expenses. If you have WhatsApp notifications enabled, you'll receive an alert the second you hit your limit!</p>
    `,
  },
  {
    id: "15",
    title: "Understanding Project Analytics",
    slug: "project-analytics-guide",
    category: "Features & Integrations",
    excerpt: "Insights into your productivity and budget performance.",
    content: `
        <h2>Data-Driven Decisions</h2>
        <p>Hikari provides visual reports to help you understand your performance over time.</p>
        <h3>Task Velocity</h3>
        <p>View how many tasks you complete each week. This helps you estimate future projects more accurately.</p>
        <h3>Budget Burn Rate</h3>
        <p>See how quickly you're spending your budget over the course of a month. Our AI will alert you if your current spending trajectory will cause you to exceed your limit.</p>
        <h3>Project Health</h3>
        <p>A color-coded indicator (Green, Yellow, Red) tells you at a glance if your project is on time and within budget.</p>
    `,
  },
  {
    id: "16",
    title: "The Ultimate Guide to the Hikari Method",
    slug: "ultimate-guide-hikari-method",
    category: "The Hikari Method",
    excerpt: "Master the philosophy of linking your tasks to your budget for radical clarity and intentional productivity.",
    content: `
        <h2>The Core Philosophy: Why Tasks and Budgets Belong Together</h2>
        <p>For decades, we’ve been taught to manage our lives in two separate silos: our <strong>To-Do List</strong> and our <strong>Budget</strong>. We plan our day in one app and track our spending in another. The result? A constant sense of disconnect. You feel productive because you checked off 10 tasks, but stressed because you don't know if you can afford the project you just planned.</p>
        
        <p>The <strong>Hikari Method</strong> is the bridge between these two worlds. It is built on the principle of <strong>Radical Clarity</strong>: the idea that every hour of your time has a cost, and every dollar of your money has a purpose.</p>

        <h3>1. Give Every Task a Job (The Foundation)</h3>
        <p>In traditional budgeting, we "give every dollar a job." In the Hikari Method, we take this further: <strong>Give every task a budget.</strong></p>
        <p>When you create a task, whether it's "Fix the kitchen sink" or "Launch a marketing campaign", you must immediately ask: <em>What is the financial cost of this action?</em> By linking a budget limit to a task, you transform it from a vague intention into a funded commitment. You no longer just "do" things; you execute investments in your own life.</p>

        <h3>2. The Power of Real-Time Syncing</h3>
        <p>One of the biggest pitfalls of productivity is the "invisible cost." We agree to a new project without realizing it will drain our discretionary spending for the month. Hikari solves this with <strong>Real-Time Syncing</strong>.</p>
        <p>As you log expenses against a task, your overall project budget updates instantly. This creates a feedback loop that forces intentionality. If a task is costing more than expected, you see it immediately, not at the end of the month when the credit card bill arrives.</p>

        <h3>3. Rule 5: Scale with Collaboration</h3>
        <p>Clarity isn't just for individuals. Teams often suffer from "Shadow Work", which are tasks that happen without budget approval, or spending that happens without a clear task attached. By using <strong>Rule 5: Scale with Collaboration</strong>, you bring your entire team into the Hikari ecosystem.</p>
        <p>When a teammate completes a task, the associated budget is marked as "Executed." When they log an expense, the whole team sees the impact on the project's health. This transparency builds trust and eliminates the need for constant "status update" meetings.</p>

        <h3>4. Focus Mode: Protecting Your Deep Work</h3>
        <p>True productivity requires more than just organization; it requires <strong>Focus</strong>. Our "Zen Aesthetics" in Focus Mode aren't just for looks. They are designed to dim the noise of lower-priority tasks and mute notifications, allowing you to enter a state of flow with your most important, high-budget milestones.</p>

        <h3>Conclusion: The Path to Radical Clarity</h3>
        <p>The Hikari Method isn't just a software feature, it's a lifestyle shift. It’s about moving away from reactive stress and toward proactive control. By mastering these four rules (and our new fifth rule), you aren't just managing tasks; you're mastering your future.</p>
        
        <p>Ready to start? Head over to your <a href="/dashboard">Dashboard</a> and create your first task-budget link today.</p>
    `,
  },
];
