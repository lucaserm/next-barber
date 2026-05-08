import { spawn } from "child_process"
import { promisify } from "util"

const execFile = promisify(require("child_process").execFile)

/**
 * Runs pending Prisma migrations
 * This ensures the database schema is up-to-date before the app uses Prisma
 */
export async function runMigrations(): Promise<void> {
  // Skip migrations in production - they should run in docker-entrypoint.sh
  if (process.env.NODE_ENV === "production") {
    return
  }

  // Skip if explicitly disabled
  if (process.env.SKIP_DB_INIT === "true") {
    return
  }

  try {
    console.log("🔄 Checking database migrations...")
    await execFile("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      timeout: 30000,
    })
    console.log("✅ Database migrations completed")
  } catch (error: any) {
    // If migrations fail, log but don't crash in development
    // This allows developers to manually fix the schema
    if (process.env.NODE_ENV === "development") {
      console.error("⚠️ Migration check failed:", error.message)
      console.error("Run 'npm run db:migrate' manually to fix")
    } else {
      throw error
    }
  }
}
