import { Context } from "hono";
import { MiddlewareHandler, Next } from "hono/types";
import { HonoConfig, ParticipationConditionType } from "./types";
import { and, eq, gt } from "drizzle-orm";
import { getModels } from "./schemas";
import { z } from "@hono/zod-openapi";

export const authRequired: MiddlewareHandler = async (c: Context<HonoConfig>, next: Next)  => {
	const token = c.req.header('Authorization')?.replace('Bearer ', '') || c.req.query('token');
	if (!token) return c.json({ err: 'No token provided' }, 401);
	const {sessions, users} = getModels();
	const { drizzle } = c.env;
	try {
		const [session] = await drizzle.select({userId: sessions.userId}).from(sessions)
			.where(and(
				eq(sessions.token, token),
				gt(sessions.expires, new Date()),
			));
		if (!session) return c.json({ err: 'Invalid token' }, 401);
		const [user] = await drizzle.select({
				id: users.id,
				username: users.username,
				displayName: users.displayName,
				email: users.email,
				iconUrl: users.iconUrl,
				profile: users.profile,
				projectsCount: users.projectsCount,
				threadsCount: users.threadsCount,
				messagesCount: users.messagesCount,
				votesCount: users.votesCount,
				likesCount: users.likesCount,
				followersCount: users.followersCount,
				followsCount: users.followsCount,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
			})
			.from(users)
			.where(eq(users.id, session.userId));
		if (!user) return c.json({ err: 'User not found' }, 404);
		c.env.user = user;
		c.env.token = token;
		await next();
	} catch (e: any) {
		return c.json({ err: e }, 500);
	}
};

export const ErrorSchema = z.object({
	err: z.string().openapi({
		example: 'This is error message.'
	}),
});

export const EmptySchema = z.object({
});

export const HeadersSchema = z.object({
  authorization: z.string().openapi({
    example: 'Bearer SECRET',
  }),
});

export const ProjectSchema = z.object({
  slug: z.string().min(3).max(255).openapi({
    example: 'noroshi',
  }),
  name: z.string().min(3).max(255).openapi({
    example: 'Noroshi',
  }),
  description: z.string().optional().openapi({
    example: 'Talk with us!',
  }),
  membersCount: z.number().openapi({
    example: 1,
  }),
  iconUrl: z.string().optional().openapi({
    example: 'https://example.com/icon.png',
  }),
	threadsCount: z.number().openapi({
		example: 0,
	}),
	messagesCount: z.number().openapi({
		example: 0,
	}),
	participationCondition: z.number().openapi({
		example: 0,
	}),
	createdAt: z.string().openapi({
		example: '2021-01-01T00:00:00Z',
	}),
	updatedAt: z.string().openapi({
		example: '2021-01-01T00:00:00Z',
	}),
});
