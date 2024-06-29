import { Context } from 'hono';
import { HonoConfig, MemberRole, ParticipationConditionType } from '../types';
import { WITHOUT_ID_URL } from './routes';
import { getModels } from '../schemas';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		json: {
			name: string;
			description: string;
      participationCondition: number;
      iconUrl: string;
		};
	};
}>

const Create = async (c: Props) => {
  const { name, description } = c.req.valid('json');
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
        name,
        description,
        participationCondition,
        iconUrl,
      })
      .returning({
        id: projects.id,
        name: projects.name,
        description: projects.description,
      });
    await drizzle.insert(projectsMembers).values({
      projectId: project.id!,
      userId: user.id!,
      role: MemberRole.owner,
    });
    return c.json({ project: project });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
}

export { Create };
