import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
			threadId: string;
			messageId: string;
		};
	};
}>

const Create = async (c: Props) => {
  const { messageId } = c.req.valid('param');
  const userId = c.req.header('X-User-Id');
  const id = crypto.randomUUID();
  try {
    await c.env.DB.prepare(`INSERT INTO Likes (id, messageId, userId) VALUES (?, ?, ?)`).bind(id, messageId, userId).run();
    return c.json({ like: { id, userId } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };
