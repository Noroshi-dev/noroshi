import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		json: {
			name: string;
			description: string;
		};
		param: {
			projectId: string;
		};
	};
}>

const Create = async (c: Props) => {
  const { projectId } = c.req.valid('param');
  const { name, description } = c.req.valid('json');
  const id = crypto.randomUUID();
  try {
    await c.env.DB.prepare(`INSERT INTO Channels (id, projectId, name, description) VALUES (?, ?, ?, ?)`).bind(id, projectId, name, description).run();
    return c.json({ channel: { id, name, description } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };