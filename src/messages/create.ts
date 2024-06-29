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
		json: {
			content: string;
		};
	};
}>

const Create = async (c: Props) => {
  const { threadId } = c.req.valid('param');
  const { content } = c.req.valid('json');
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  try {
    await c.env.DB.prepare(`INSERT INTO Messages (id, threadId, content, createdAt) VALUES (?, ?, ?, ?)`).bind(id, threadId, content, createdAt).run();
    return c.json({ message: { id, content, createdAt } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };
