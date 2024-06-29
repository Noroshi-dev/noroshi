import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			userId: string;
		};
    json: {
      targetType: string;
      targetId: string;
    };
	};
}>

const Create = async (c: Props) => {
  const { userId } = c.req.valid('param');
  const { targetType, targetId } = c.req.valid('json');
  const id = crypto.randomUUID();
  try {
    await c.env.DB.prepare(`INSERT INTO Follows (id, userId, targetType, targetId) VALUES (?, ?, ?, ?)`).bind(id, userId, targetType, targetId).run();
    return c.json({ follow: { id, targetType, targetId } });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };
