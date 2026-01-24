import prisma from "../config/db";
const clearDb = async () => {
    try {
        // await connectDB(); // No longer needed with Prisma
        console.log("🗑️  Clearing database...");
        // Order matters because of Foreign Keys!
        // Delete dependents first
        await prisma.expense.deleteMany({});
        console.log("✅ Expenses cleared");
        await prisma.budget.deleteMany({});
        console.log("✅ Budgets cleared");
        await prisma.task.deleteMany({});
        console.log("✅ Tasks cleared");
        await prisma.user.deleteMany({});
        console.log("✅ Users cleared");
        console.log("✨ Database cleared successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error clearing database:", error);
        process.exit(1);
    }
};
clearDb();
