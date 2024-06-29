import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
			threadId: string;
		};
	};
}>

const Index = async (c: Props) => {
  const { threadId } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; content: string; createdAt: string }[] } = await c.env.DB.prepare(`SELECT id, content, createdAt FROM Messages WHERE threadId = ? ORDER BY createdAt DESC`).bind(threadId).all();
    return c.json({ messages: results });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index };
