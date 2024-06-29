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

const Index = async (c: Props) => {
  const { messageId } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; userId: string }[] } = await c.env.DB.prepare(`SELECT id, userId FROM Dislikes WHERE messageId = ?`).bind(messageId).all();
    return c.json({ dislikes: results });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index };
