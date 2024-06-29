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

const Delete = async (c: Props) => {
  const { projectId, channelId, id } = c.req.valid('param');
  try {
    await c.env.DB.prepare(`DELETE FROM Threads WHERE id = ? AND channelId = ?`).bind(id, channelId).run();
    return c.json({});
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete };