import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL, WITH_ID_URL } from './routes';
import { getModels } from '../schemas';
import { eq } from 'drizzle-orm';
import { EmptySchema, ErrorSchema, HeadersSchema } from '../util';
import { createRoute } from '@hono/zod-openapi';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
}>

const route = createRoute({
  method: 'delete',
  path: '/',
	request: {
		headers: HeadersSchema,
	},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EmptySchema,
        },
      },
      description: 'Returns an empty object',
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

const Delete = async (c: Props) => {
  const { token, drizzle } = c.env;
	const { sessions } = getModels();
  try {
		// Delete token
		await drizzle.delete(sessions).where(eq(sessions.token, token));
    return c.json({}, 200);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete, route };