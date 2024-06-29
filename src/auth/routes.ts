import { Context, Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HonoConfig } from '../types';
// import { Create } from './create';
import { Get } from './get';
import { googleAuth } from '@hono/oauth-providers/google';
import { githubAuth } from '@hono/oauth-providers/github';
import { authRequired } from '../util';
import { Delete } from './delete';
import { Create } from './create';
// import { Delete } from './delete';

const app = new Hono<HonoConfig>();

app.get('/google', async (c: Context, next) => {
	googleAuth({
		client_id: c.env.AUTH_GOOGLE_CLIENT_ID!,
		client_secret: c.env.AUTH_GOOGLE_CLIENT_SECRET,
		scope: ['openid', 'email', 'profile'],
	});
	await next();
}, Get);

const validateJson = zValidator('json', z.object({
	username: z.string(),
	password: z.string(),
}));

// Set environment variables
// GITHUB_ID
// GITHUB_SECRET
app.get('/github', githubAuth({oauthApp: true, scope: ['user']}), Get);
app.delete('/', authRequired, Delete);
app.post('/', validateJson, Create)

type WITHOUT_ID_URL = '';
type WITH_ID_URL = `${WITHOUT_ID_URL}/:id`;
export { WITH_ID_URL, WITHOUT_ID_URL};

export default app;