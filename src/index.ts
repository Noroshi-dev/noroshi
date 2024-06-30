import { Context, Hono } from 'hono';
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui';

import ProjectRoutes from './projects/routes';
import ChannelRoutes from './channels/routes';
import ThreadRoutes from './threads/routes';
import MessageRoutes from './messages/routes';
import LikeRoutes from './likes/routes';
import DislikeRoutes from './dislikes/routes';
import FollowRoutes from './follows/routes';
import UserRoutes from './users/routes';
import AuthRoutes from './auth/routes';
import { HonoConfig } from './types';

import { getDrizzle } from './db/drizzle';
const app = new OpenAPIHono<HonoConfig>();

app.use(async (ctx: Context, next: () => Promise<void>) => {
	ctx.env.drizzle = getDrizzle()(ctx.env.DB);
	await next();
});

app.route('/projects/:projectId/channels/:channelId/threads/:threadId/messages/:messageId/dislikes', DislikeRoutes);
app.route('/projects/:projectId/channels/:channelId/threads/:threadId/messages/:messageId/likes', LikeRoutes);
app.route('/projects/:projectId/channels/:channelId/threads/:threadId/messages', MessageRoutes);
app.route('/projects/:projectId/channels/:channelId/threads', ThreadRoutes);
app.route('/projects/:projectId/channels', ChannelRoutes);
app.route('/projects', ProjectRoutes);
app.route('/users', UserRoutes);
app.route('/users/:userId/follows', FollowRoutes);
app.route('/auth', AuthRoutes);

app.doc31("/doc", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Noroshi API",
  },
});

app.get('/ui', swaggerUI({ url: "/doc" }));

export default app;
