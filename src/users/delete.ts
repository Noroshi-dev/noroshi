import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';
import { getModels } from '../schemas';
import { eq } from 'drizzle-orm';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
}>

const Delete = async (c: Props) => {
	const { user, drizzle }  = c.env;
	const { users } = getModels();
	console.log({ user });
	if (!user || !user.id) return c.json({ err: 'User not found.' }, 404);
  try {
		// Delete user
		await drizzle.delete(users).where(eq(users.id, user.id));
    return c.json({});
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Delete };