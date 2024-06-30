
## Database

### Generate migration files

```bash
npx drizzle-kit generate
```

### Run migrations

```bash
# To local
npx wrangler d1 migrations apply noroshi-db --local

# To staging
npx wrangler d1 migrations apply noroshi-db
```

# API

http://localhost:9000/ui
