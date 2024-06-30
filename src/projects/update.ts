import { Context } from 'hono';
import { WITH_ID_URL } from './routes';
import { HonoConfig, MemberRole } from '../types';
import { createRoute, z } from '@hono/zod-openapi';
import { HeadersSchema, ProjectSchema, ErrorSchema } from '../util';
import { getModels } from '../schemas';
import { and, eq } from 'drizzle-orm';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			slug: string;
		};
		json: {
			name: string;
      slug: string;
			description: string;
      participationCondition: number;
      iconUrl: string;
		};
	};
}>

const route = createRoute({
  method: 'put',
  path: '/{slug}',
  request: {
		params: z.object({
			slug: z.string(),
		}),
		headers: HeadersSchema,
		body: {
			description: 'Update a project',
			content: {
				'application/json': {
					schema: z.object({
            slug: z.string().min(3).max(255).openapi({
              example: 'noroshi',
            }),
            name: z.string().min(3).max(255).openapi({
              example: 'Noroshi',
            }),
            description: z.string().optional().openapi({
              example: 'Talk with us!',
              default: '',
            }),
            participationCondition: z.number().optional().openapi({
              example: 0,
              default: 0,
            }),
            iconUrl: z.string().optional().openapi({
              example: 'https://example.com/icon.png',
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
          schema: z.object({
            project: ProjectSchema,
          }),
        },
      },
      description: 'Returns a project object',
    },
		401: {
			content: {
				'application/json': {
					schema: ErrorSchema,
				},
			},
			description: 'Unauthorized or no permission',
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

const Update = async (c: Props) => {
  const { slug } = c.req.valid('param');
	const { drizzle, user } = c.env;
	const { projects, projectsMembers } = getModels();
  const params = c.req.valid('json');
  try {
		// Get project
		const [ project ] = await drizzle.select().from(projects).where(eq(projects.slug, slug));
		if (!project) return c.json({ err: 'Project not found' }, 404);
		// Check permission
		const [ projectMember ] = await drizzle.select().from(projectsMembers).where(and(
			eq(projectsMembers.projectId, project.id),
			eq(projectsMembers.userId, user.id!)));
		if (!projectMember) return c.json({ err: 'Unauthorized or no permission' }, 401);
		if (projectMember.role !== MemberRole.owner) return c.json({ err: 'Unauthorized or no permission' }, 401);
		// Update project
		const [res] = await drizzle.update(projects).set({
			name: params.name || project.name,
      slug: params.slug || project.slug,
			description: params.description || project.description,
      participationCondition: params.participationCondition || project.participationCondition,
      iconUrl: params.iconUrl || project.iconUrl,
			updatedAt: (new Date()).toISOString(),
		})
		.returning({
			slug: projects.slug,
			name: projects.name,
			description: projects.description,
			iconUrl: projects.iconUrl,
			membersCount: projects.membersCount,
			messagesCount: projects.messagesCount,
			threadsCount: projects.threadsCount,
			participationCondition: projects.participationCondition,
			createdAt: projects.createdAt,
			updatedAt: projects.updatedAt,
		});
    return c.json({ project: res }, 200);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Update, route };
