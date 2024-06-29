import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
			id: string;
		};
	};
}>

const Get = async (c: Props) => {
  const { projectId, channelId, id } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; title: string; content: string }[] } = await c.env.DB.prepare(`SELECT id, title, content FROM Threads WHERE id = ? AND channelId = ?`).bind(id, channelId).all();
    return c.json({ thread: results[0] });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Get };