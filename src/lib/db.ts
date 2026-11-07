import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };
const retryable = new Set(["P1001", "P1002", "P1017"]);

function createClient() {
  const client = new PrismaClient();
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          let last: unknown;
          for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
              return await query(args);
            } catch (error) {
              last = error;
              const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : "";
              if (!retryable.has(code) || attempt === 2) throw error;
              await client.$disconnect().catch(() => undefined);
              await new Promise((resolve) => setTimeout(resolve, 3000 * (attempt + 1)));
            }
          }
          throw last;
        },
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
