import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Override Decimal serialization to numbers instead of strings
// to prevent string concatenation and NaN issues on the frontend.
(Prisma.Decimal.prototype as any).toJSON = function () {
  return this.toNumber();
};

export default prisma;
