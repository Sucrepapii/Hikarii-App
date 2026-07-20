import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "akinboroo@gmail.com";
  console.log(`Setting user: ${email} to PERMANENT PRO plan...`);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error(`Error: User with email ${email} not found.`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        subscriptionStatus: "PRO",
        subscriptionId: "PERMANENT_PRO_VIP",
        currentPeriodEnd: new Date("2099-12-31T23:59:59Z"),
      },
    });

    console.log(
      `✅ Success! User ${updatedUser.email} is now permanently ${updatedUser.subscriptionStatus}.`,
    );
    console.log(`Please ask the user to refresh their page.`);
  } catch (error) {
    console.error("Failed to set user to PRO:", error);
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
