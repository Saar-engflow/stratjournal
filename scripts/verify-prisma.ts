import "dotenv/config"
import { prisma } from "../src/lib/prisma"

async function main() {
  console.log("Testing Prisma connection...")
  const result = await prisma.$queryRaw`SELECT 1 as test`
  console.log("✅ Connected to Prisma database successfully!")
  console.log("Test query result:", result)
}

main()
  .catch((e) => {
    console.error("❌ Prisma connection failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
