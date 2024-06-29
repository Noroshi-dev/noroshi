import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			projectId: string;
		};
	};
}>

const Index = async (c: Props) => {
  const { projectId } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; name: string; description: string }[] } = await c.env.DB.prepare(`SELECT id, name, description FROM Channels WHERE projectId = ?`).bind(projectId).all();
    return c.json({ channels: results });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index };
