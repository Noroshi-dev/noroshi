import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
			threadId: string;
			id: string;
		};
	};
}>

const Get = async (c: Props) => {
  const { threadId, id } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; content: string; createdAt: string }[] } = await c.env.DB.prepare(`SELECT id, content, createdAt FROM Messages WHERE id = ? AND threadId = ?`).bind(id, threadId).all();
    return c.json({ message: results[0] });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Get };
