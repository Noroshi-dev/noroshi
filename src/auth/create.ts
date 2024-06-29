import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';
import { getModels } from '../schemas';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createToken } from './utils';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		json: {
			username: string;
			password: string;
		};
	};
}>

const Create = async (c: Props) => {
  const { username, password } = c.req.valid('json');
	const { users } = getModels();
	const { drizzle } = c.env;
  try {
		// Find out user
		const [ user ] = await drizzle.select().from(users).where(eq(users.username, username));
		if (!user) return c.json({ err: 'Log in failed.' }, 404);
		// Check password
		if (!user.passwordHash) return c.json({ err: 'Log in failed.' }, 404);
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return c.json({ err: 'Log in failed.' }, 404);
		// Create session
		const token = await createToken(drizzle, user.id);
		return c.json({ token });
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };
