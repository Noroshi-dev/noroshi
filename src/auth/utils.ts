import { DrizzleD1Database } from "drizzle-orm/d1";
import { getModels } from "../schemas";
import { v7 as uuidv7 } from 'uuid';

export const createToken = async (drizzle: DrizzleD1Database, userId: number): Promise<string> => {
	const { sessions } = getModels();
	const token = uuidv7();
	const [session] = await drizzle.insert(sessions)
		.values({
			userId,
			token,
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		})
		.returning({ token: sessions.token });
	return token;
}
