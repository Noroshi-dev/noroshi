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
		json: {
			content: string;
		};
	};
}>

const Update = async (c: Props) => {
  const { threadId, id } = c.req.valid('param');
  const { content } = c.req.valid('json');
  try {
    await c.env.DB.prepare(`UPDATE Messages SET content = ? WHERE id = ? AND threadId = ?`).bind(content, id, threadId).run();
    return c.json({ message: { id, content } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Update };
