import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";

const connectionString = process.env.DATABASE_URL!;

const connection = connect({ url: connectionString });
const adapter = new PrismaTiDBCloud(connection);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Pass the TiDB Cloud adapter to enable HTTPS serverless transport
    adapter: adapter as unknown as any,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
