import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			userId: string;
		};
	};
}>

const Index = async (c: Props) => {
  const { userId } = c.req.valid('param');
  try {
    const { results }: { results: { id: string; targetType: string; targetId: string }[] } = await c.env.DB.prepare(`SELECT id, targetType, targetId FROM Follows WHERE userId = ?`).bind(userId).all();
    return c.json({ follows: results });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index };
