import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@hikarii.org";
  const password = "adminPassword123!";
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
      subscriptionStatus: "PRO",
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
