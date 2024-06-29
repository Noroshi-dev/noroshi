import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITHOUT_ID_URL } from './routes';
import { getModels } from '../schemas';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		json: {
			username: string,
			password: string,
			displayName: string | undefined,
			email: string | undefined,
		};
	};
}>

const Create = async (c: Props) => {
  const params = c.req.valid('json');
	const passwordHash = await bcrypt.hash(params.password, 10);
  try {
		const { drizzle } = c.env;
		const { users } = getModels();
		// Find same username
		const [ sameUser ] = await drizzle.select()
			.from(users)
			.where(eq(users.username, params.username));
		if (sameUser) {
			return c.json({ err: `Username ${params.username} already exists.`}, 400);
		}
		const [ user ] = await drizzle.insert(users).values({
			username: params.username,
			passwordHash,
			displayName: params.displayName || params.username,
			email: params.email || null,
		})
		.returning({
			username: users.username,
			displayName: users.displayName,
			email: users.email,
		});
		return c.json({ user }, 201);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Create };
