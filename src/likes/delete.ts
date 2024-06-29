import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			projectId: string;
			channelId: string;
			threadId: string;
			messageId: string;
			id: string;
		};
	};
}>

const Delete = async (c: Props) => {
  const { messageId, id } = c.req.valid('param');
  try {
    await c.env.DB.prepare(`DELETE FROM Likes WHERE id = ? AND messageId = ?`).bind(id, messageId).run();
    return c.json({});
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete };
