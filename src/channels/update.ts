import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		json: {
			name: string;
			description: string;
		};
		param: {
			id: string;
			projectId: string;
		};
	};
}>

const Update = async (c: Props) => {
  const { projectId, id } = c.req.valid('param');
  const { name, description } = c.req.valid('json');
  try {
    await c.env.DB.prepare(`UPDATE Channels SET name = ?, description = ? WHERE id = ? AND projectId = ?`).bind(name, description, id, projectId).run();
    return c.json({ channel: { id, name, description } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Update };

