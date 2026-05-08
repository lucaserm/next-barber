const { spawn } = require("child_process");

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on("error", (error) => {
      reject(error);
    });
  });
}

async function runMigrations() {
  console.log("🔄 Running database migrations...");
  try {
    await runCommand("npm", ["run", "db:migrate"]);
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migrations failed:", error.message);
    throw error;
  }
}

async function runSeed() {
  console.log("🌱 Seeding database...");
  try {
    await runCommand("npm", ["run", "db:seed"]);
    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.warn("⚠️  Seed error (optional):", error.message);
  }
}

async function startServer() {
  console.log("🚀 Starting Next.js server...");
  try {
    await runCommand("node", ["server.js"]);
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
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
