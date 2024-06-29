import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL, WITH_ID_URL } from './routes';
import { getModels } from '../schemas';
import { eq } from 'drizzle-orm';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			id: string;
		};
	};
}>

const Delete = async (c: Props) => {
  const { token, drizzle } = c.env;
	const { sessions } = getModels();
  try {
		// Delete token
		await drizzle.delete(sessions).where(eq(sessions.token, token));
    return c.json({});
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete };