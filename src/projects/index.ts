import { Context } from 'hono';
import { WITHOUT_ID_URL } from './routes';
import { HonoConfig } from '../types';
import { getModels } from '../schemas';
import { like, or } from 'drizzle-orm';
import { createRoute, z } from '@hono/zod-openapi';
import { ProjectSchema, ErrorSchema } from '../util';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
  out: {
    queries: {
      term?: string;
      limit?: number;
      offset?: number;
    }
  }
}>

const route = createRoute({
  method: 'get',
  path: '/',
  request: {
    params: z.object({
      limit: z.number().optional().openapi({
        example: 10,
        default: 10,
        maximum: 100,
        minimum: 1,
      }),
      offset: z.number().optional().openapi({
        example: 0,
      }),
      term: z.string().optional().openapi({
        description: 'Search term. Search by name or description.',
        example: 'project',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
						projects: z.array(ProjectSchema),
					}),
        },
      },
      description: 'Returns projects object',
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


const DEFAULT_LIMIT = 10;
const Index = async (c: Props) => {
  try {
    const { drizzle } = c.env;
    const { projects } =  getModels();
    const term = c.req.query('term');
    const limit = c.req.query('limit');
    const offset = c.req.query('offset');
    const query = drizzle.select().from(projects);
    if (limit) {
      const num = parseInt(limit) === 0 ? DEFAULT_LIMIT : parseInt(limit) > 100 ? 100 : parseInt(limit);
      query.limit(num);
    }
    if (offset) {
      query.offset(parseInt(offset));
    }
    if (term) {
      query.where(or(
        like(projects.name, `%${term}%`),
        like(projects.description, `%${term}%`)
      ));
    }
    const results = await query;
    return c.json({ projects: results.map(p => {
      const { id, ...rest } = p;
      return rest;
    })}, 200);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index, route };
