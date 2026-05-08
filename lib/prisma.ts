import { PrismaClient } from "@prisma/client"
import { runMigrations } from "./db-init"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaInitialized?: boolean
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Ensure migrations run before any queries in development
if (!globalForPrisma.prismaInitialized && process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaInitialized = true
  runMigrations().catch((error) => {
    console.error("Failed to initialize database:", error)
    // Don't exit - let the app start and the developer can fix it
  })
}
