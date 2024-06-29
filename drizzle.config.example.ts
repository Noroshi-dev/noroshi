import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit'

const remoteConfig = {
  schema: "./src/schemas/schema-sqlite.ts", // or "./src/shemas/schema-postgres.ts" or "./src/schemas/schema-mysql.ts"
  out: "./src/migrations",
  dialect: 'sqlite', // or 'postgresql' or 'mysql'
  driver: "d1-http",
  dbCredentials: {
    accountId: "YOUR_ACCOUNT_ID",
    databaseId: "YOUR_DATABASE_ID",
    token: "YOUR_TOKEN",
  },
  verbose: true,
  strict: true,
};
// const remoteConfig = defineConfig(remoteParams as any) satisfies Config;

const localConfig = {
  schema: "./src/schemas/schema-sqlite.ts",
  dialect: 'sqlite',
  dbCredentials: {
    url: "./.wrangler/your/path/to.sqlite"
  },
};

const config = process.env.NODE_ENV === 'production' ? remoteConfig : localConfig;
export { config };

export default defineConfig(config as any) satisfies Config;
