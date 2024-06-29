import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
		};
	};
}>

const Index = async (c: Props) => {
  const { projectId, channelId } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; title: string; content: string }[] } = await c.env.DB.prepare(`SELECT id, title, content FROM Threads WHERE channelId = ?`).bind(channelId).all();
    return c.json({ threads: results });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index };
