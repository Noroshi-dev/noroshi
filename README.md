
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

## Authentication

Authentication header is below.

```ts
{
	Authorization: `Bearer ${token}`
}
```

## User

### Create user

```
POST /users
```

#### Request

```ts
{
	username: string,
	password: string,
	displayName: string | undefined,
	email: string | undefined,
}
```

#### Response

```ts
{
	username
	displayName
	email
}
```

### Delete user

```
DELETE /users
```

Authorization header is required.

### Request

None

### Response

```ts
{}
```

## Auth

### Login

```
POST /auth
```

#### Request

```ts
{
	username: string,
	password: string,
}
```

#### Response

```ts
{
	token: string
}
```

### Logout

```
DELETE /auth
```

Authorization header is required.

#### Request

None

#### Response

```ts
{}
```
