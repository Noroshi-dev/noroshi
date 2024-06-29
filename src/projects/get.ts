import { Context } from 'hono';
import { WITH_ID_URL } from './routes';
import { HonoConfig } from '../types';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			id: string;
		};
	};
}>

const Get = async (c: Props) => {
	const { id } = c.req.valid('param');
	try {
		const { results }: { results: { id: string; name: string; description: string }[] } = await c.env.DB.prepare(`SELECT id, name, description FROM Projects WHERE id = ?`).bind(id).all();
		return c.json({ project: results[0] });
	} catch (e: any) {
		return c.json({ err: e }, 500);
	}
};

export { Get };
