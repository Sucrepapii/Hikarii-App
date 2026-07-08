import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function verify() {
  try {
    await prisma.user.update({
      where: { email: "student@test.com" },
      data: { isVerified: true },
    });
    console.log("User verified.");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
