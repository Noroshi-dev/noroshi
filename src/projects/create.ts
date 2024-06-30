import { Context } from 'hono';
import { HonoConfig, MemberRole, ParticipationConditionType } from '../types';
import { WITHOUT_ID_URL } from './routes';
import { getModels } from '../schemas';
import { ErrorSchema, HeadersSchema, ProjectSchema } from '../util';
import { createRoute, z } from '@hono/zod-openapi';
import { messages, threads } from '../schemas/schema-sqlite';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
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
  method: 'post',
  path: '/',
  request: {
    headers: HeadersSchema,
		body: {
			description: 'Create a project',
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
    201: {
      content: {
        'application/json': {
          schema: z.object({
            project: ProjectSchema,
          }),
        },
      },
      description: 'Returns a project object',
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

const Create = async (c: Props) => {
  const { name, description, slug } = c.req.valid('json');
  const participationCondition = [
    ParticipationConditionType.anyMember,
    ParticipationConditionType.examination,
    ParticipationConditionType.invitation,
  ].includes(c.req.valid('json').participationCondition) ?
    c.req.valid('json').participationCondition : ParticipationConditionType.anyMember;
  const iconUrl = c.req.valid('json').iconUrl || `${c.env.ASSETS_URL}/project-icon.png`;
  const { projects, projectsMembers } = getModels();
  const { user, drizzle } = c.env;
  try {
    const [project] = await drizzle.insert(projects).values({
        slug,
        name,
        description,
        participationCondition,
        iconUrl,
        membersCount: 1,
      })
      .returning({
        id: projects.id,
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
    await drizzle.insert(projectsMembers).values({
      projectId: project.id!,
      userId: user.id!,
      role: MemberRole.owner,
    });
    // remove id from project object
    const { id, ...rest } = project;
    return c.json({ project: rest }, 201);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
}

export { Create, route };
