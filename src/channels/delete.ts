import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		json: {
			name: string;
			description: string;
		};
		param: {
			id: string;
			projectId: string;
		};
	};
}>

const Delete = async (c: Props) => {
  const { projectId, id } = c.req.valid('param');
  try {
    await c.env.DB.prepare(`DELETE FROM Channels WHERE id = ? AND projectId = ?`).bind(id, projectId).run();
    return c.json({});
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete };
