import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
		};
		json: {
			title: string;
			content: string;
		};
	};
}>

const Create = async (c: Props) => {
  const { projectId, channelId } = c.req.valid('param');
  const { title, content } = c.req.valid('json');
  const id = crypto.randomUUID();
  try {
    await c.env.DB.prepare(`INSERT INTO Threads (id, channelId, title, content) VALUES (?, ?, ?, ?)`).bind(id, channelId, title, content).run();
    return c.json({ thread: { id, title, content } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };
