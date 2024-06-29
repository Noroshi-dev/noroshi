import { Context } from 'hono';
import { WITH_ID_URL } from './routes';
import { HonoConfig } from '../types';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			id: string;
		};
		json: {
			name: string;
			description: string;
		};
	};
}>

const Update = async (c: Props) => {
  const { id } = c.req.valid('param');
  const { name, description } = c.req.valid('json');
  try {
    await c.env.DB.prepare(`UPDATE Projects SET name = ?, description = ? WHERE id = ?`).bind(name, description, id).run();
    return c.json({ project: { id, name, description } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Update };
