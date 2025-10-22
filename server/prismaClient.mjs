import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set in environment");

const connection = connect({ url: connectionString });
const adapter = new PrismaTiDBCloud(connection);

// create prisma client with adapter
export const prisma = new PrismaClient({
  // adapter needs to be passed; cast to any to avoid TS issues in runtime
  adapter: adapter,
  log: ["warn", "error"],
});

// graceful shutdown
process.on("exit", async () => {
  try {
    await prisma.$disconnect();
  } catch (e) {}
});

export default prisma;
