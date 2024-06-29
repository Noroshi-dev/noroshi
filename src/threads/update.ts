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
		json: {
			title: string;
			content: string;
		};
	};
}>

const Update = async (c: Props) => {
  const { projectId, channelId, id } = c.req.valid('param');
  const { title, content } = c.req.valid('json');
  try {
    await c.env.DB.prepare(`UPDATE Threads SET title = ?, content = ? WHERE id = ? AND channelId = ?`).bind(title, content, id, channelId).run();
    return c.json({ thread: { id, title, content } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Update };

