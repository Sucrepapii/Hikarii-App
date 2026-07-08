import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "akinboroo@gmail.com";
  console.log(`Resetting user: ${email} to FREE plan...`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error(`Error: User with email ${email} not found.`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        subscriptionStatus: "FREE",
        subscriptionId: null,
        currentPeriodEnd: null,
      },
    });

    console.log(
      `✅ Success! User ${updatedUser.email} is now ${updatedUser.subscriptionStatus}.`,
    );
    console.log(`Please ask the user to refresh their page.`);
  } catch (error) {
    console.error("Failed to reset user:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
