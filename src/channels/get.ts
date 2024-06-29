import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			projectId: string;
			id: string;
		};
	};
}>

const Get = async (c: Props) => {
  const { projectId, id } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; name: string; description: string }[] } = await c.env.DB.prepare(`SELECT id, name, description FROM Channels WHERE id = ? AND projectId = ?`).bind(id, projectId).all();
    return c.json({ channel: results[0] });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Get };
