import { Context, Next } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';
import { getModels } from '../schemas';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createToken } from './utils';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { ErrorSchema } from '../util';

type Props = Context<HonoConfig, "/auth", {
	out: {
			json: {
					password: string;
					username: string;
			};
	};
}>

const TokenSchema = z.object({
	token: z.string().openapi({
		example: 'eyJhbGciOi-JIUzI1NiIsIn-R5cCI6Ik'
	}),
});

const route = createRoute({
  method: 'post',
  path: '/',
  request: {
		body: {
			description: 'Log in with username and password',
			content: {
				'application/json': {
					schema: z.object({
						username: z.string().min(3).max(255).openapi({
							example: 'noroshi',
						}),
						password: z.string().min(8).max(255).openapi({
							example: 'your-secret-password',
						}),
					}),
				},
			},
		}
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TokenSchema,
        },
      },
      description: 'Returns a token',
    },
		404: {
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
			description: 'Not found',
		},
		500: {
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
			description: 'Internal server error',
		},
  },
})

const Create = async (c: Props) => {
  const { username, password } = c.req.valid('json');
	const { users } = getModels();
	const { drizzle } = c.env;
  try {
		// Find out user
		const [ user ] = await drizzle.select().from(users).where(eq(users.username, username));
		if (!user) {
			return c.json({ err: 'Log in failed.' }, 404);
		}
		// Check password
		if (!user.passwordHash) return c.json({ err: 'Log in failed.' }, 404);
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return c.json({ err: 'Log in failed.' }, 404);
		// Create session
		const token = await createToken(drizzle, user.id);
		return c.json({ token }, 200);
  } catch (e: any) {
    return c.json({ err: JSON.stringify(e) }, 500);
  }
};

export { Create, route };
