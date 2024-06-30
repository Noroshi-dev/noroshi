import { Context } from 'hono';
import { WITH_ID_URL } from './routes';
import { HonoConfig } from '../types';
import { createRoute, z } from '@hono/zod-openapi';
import { HeadersSchema, EmptySchema, ErrorSchema, ProjectSchema } from '../util';
import { getModels } from '../schemas';
import { eq } from 'drizzle-orm';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			slug: string;
		};
	};
}>

const route = createRoute({
  method: 'get',
  path: '/{slug}',
  request: {
    params: z.object({
      slug: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
						project: ProjectSchema,
					}),
        },
      },
      description: 'Returns a project object',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Project not found',
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
});

const Get = async (c: Props) => {
	const { slug } = c.req.valid('param');
	const { projects } = getModels();
	const { drizzle } = c.env;
	try {
		// Find project
		const [ project ] = await drizzle.select().from(projects).where(eq(projects.slug, slug));
		if (!project) {
			return c.json({ err: 'Project not found.' }, 404);
		}
		const { id, ...rest } = project;
		return c.json({ project: rest }, 200);
	} catch (e: any) {
		return c.json({ err: e }, 500);
	}
};

export { Get, route };
