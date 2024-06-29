import { Context } from 'hono';
import { HonoConfig } from '../types';
import { WITH_ID_URL } from './routes';
import { googleAuth } from '@hono/oauth-providers/google';
import { githubAuth } from '@hono/oauth-providers/github';
import { and, desc, eq } from 'drizzle-orm';
import { getModels } from '../schemas';
import type { accountType, userType } from '../schemas';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { createToken } from './utils';
// import crypto from 'node:crypto';

type Props = Context<HonoConfig, WITH_ID_URL, {
	out: {
		param: {
			id: string;
		};
	};
}>

interface AccountParams {
	id: string;
	provider: string;
	username: string;
	displayName: string;
	email: string | null | undefined;
	description?: string;
	iconUrl?: string;
	token?: string;
};

const Get = async (c: Props) => {
	const githubUser = c.get('user-github');
	if (!githubUser) {
		return c.json({ err: 'Authentication failed.' }, 401);
	}
	const { drizzle } = c.env;
	const params: AccountParams = {
		id: `${githubUser.id}`,
		provider: 'github',
		username: `${githubUser.id}@github`,
		displayName: `${githubUser.name}@github`,
		email: githubUser.email,
		description: githubUser.bio,
		iconUrl: githubUser.avatar_url,
		token: c.get('token')?.token,
	};

	// Find account
	const { user } =  await findOrCreateUserAccount(drizzle, params);
	// Create session
	const token = await createToken(drizzle, user.id!);
	return c.json({ token });
};

interface findUserAccountResponse {
	user: userType;
	account: accountType;
}
const findUserAccount = async (
	drizzle: DrizzleD1Database<Record<string, never>>,
	params: AccountParams): Promise<findUserAccountResponse | null> => {
	// Find account
	const { accounts, users } =  getModels();
	const [res] = await drizzle
		.select()
		.from(users)
		.leftJoin(accounts, eq(users.id, accounts.userId))
		.where(and(
			eq(accounts.provider, params.provider),
			eq(accounts.providerId, params.id)
		))
		.limit(1);
	if (res) {
		await drizzle.update(accounts)
			.set({token: params.token})
			.where(and(
				eq(accounts.provider, params.provider),
				eq(accounts.providerId, params.id)
		));
		return {
			user: res.users,
			account: res.accounts!
		};
	}
	return null;
}

const findOrCreateUserAccount = async (
	drizzle: DrizzleD1Database<Record<string, never>>,
	params: AccountParams): Promise<findUserAccountResponse> => {
	const { accounts, users } =  getModels();
	const res = await findUserAccount(drizzle, params);
	if (res) { // User and account are exist
		await drizzle.update(accounts)
			.set({token: params.token})
			.where(and(
				eq(accounts.provider, params.provider),
				eq(accounts.providerId, params.id)
		));
		return res;
	}
	const [{ userId }] = await drizzle.insert(users)
		.values({
			username: params.username,
			displayName: params.displayName,
			email: params.email,
			emailVerified: new Date(),
			profile: params.description,
			iconUrl: params.iconUrl,
		})
		.returning({ userId: users.id });
	await drizzle.insert(accounts)
		.values({
			userId,
			provider: params.provider,
			providerId: params.id,
			token: params.token,
		});
	// Find user and account again
	const data = await findUserAccount(drizzle, params);
	if (!data) {
		throw new Error('User and account are not created.');
	}
	return data;
};

export { Get };
