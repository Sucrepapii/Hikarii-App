import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@hikarii.org";
  const password = process.env.TEST_ADMIN_PASSWORD;

  if (!password) {
    throw new Error("TEST_ADMIN_PASSWORD environment variable is required to run verify-admin.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      name: "Admin User",
      email,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log(
    `Admin user ${admin.email} created/updated with role ${admin.role}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
