import { Context } from 'hono';
import { HonoConfig, MemberRole } from '../types';
import { WITH_ID_URL } from './routes';
import { EmptySchema, ErrorSchema, HeadersSchema } from '../util';
import { createRoute, z } from '@hono/zod-openapi';
import { getModels } from '../schemas';
import { and, eq } from 'drizzle-orm';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			slug: string;
		};
	};
}>

const route = createRoute({
  method: 'delete',
  path: '/{slug}',
  request: {
    params: z.object({
      slug: z.string(),
    }),
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
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Project not found',
    },
    401: {
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
			description: 'Unauthorized or no permission',
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

const Delete = async (c: Props) => {
  const { slug } = c.req.valid('param');
  const { user, drizzle } = c.env;
  const { projects, projectsMembers } = getModels();
  try {
    // Get project id
    const [ { id } ] = await drizzle.select({id: projects.id}).from(projects).where(eq(projects.slug, slug));
    if (!id) return c.json({ err: 'Project not found' }, 404);
    // Check permissions
    const [ member ] = await drizzle.select().from(projectsMembers).where(and(
      eq(projectsMembers.projectId, id),
      eq(projectsMembers.userId, user.id!),
    ))
    if (!member) return c.json({ err: 'Unauthorized or no permission' }, 401);
    if (member.role !== MemberRole.owner) return c.json({ err: 'Unauthorized or no permission' }, 401);
    // Delete project
    await drizzle.delete(projects).where(eq(projects.id, id));
    return c.json({}, 200);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete, route };