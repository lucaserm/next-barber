const { spawn } = require("child_process");
const path = require("path");

async function runMigrations() {
  return new Promise((resolve, reject) => {
    console.log("🔄 Running database migrations...");

    const migrate = spawn("prisma", ["migrate", "deploy"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        PATH: `${path.join(process.cwd(), "node_modules/.bin")}:${process.env.PATH}`,
      },
    });

    migrate.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Migrations completed successfully");
        resolve();
      } else {
        console.error(`❌ Migrations failed with code ${code}`);
        reject(new Error(`Migration failed with exit code ${code}`));
      }
    });

    migrate.on("error", (error) => {
      console.error("❌ Failed to run migrations:", error);
      reject(error);
    });
  });
}

async function runSeed() {
  return new Promise((resolve, reject) => {
    console.log("🌱 Seeding database...");

    const seed = spawn("tsx", ["prisma/seed.ts"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        PATH: `${path.join(process.cwd(), "node_modules/.bin")}:${process.env.PATH}`,
      },
    });

    seed.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Seed completed successfully");
        resolve();
      } else {
        console.warn(`⚠️  Seed skipped (code ${code}, might be already seeded)`);
        resolve();
      }
    });

    seed.on("error", (error) => {
      console.warn("⚠️  Seed error (optional):", error.message);
      resolve();
    });
  });
}

async function startServer() {
  console.log("🚀 Starting Next.js server...");

  const server = spawn("node", ["server.js"], {
    stdio: "inherit",
    shell: true,
  });

  server.on("error", (error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
}

async function main() {
  try {
    await runMigrations();
    await runSeed();
    await startServer();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
