import { Hono } from 'hono';
import { z } from 'zod';
import { Index, route as IndexRoute } from './index';
import { Get, route as GetRoute } from './get';
import { zValidator } from '@hono/zod-validator';
import { Create, route as CreateRoute } from './create';
import { Update, route as UpdateRoute } from './update';
import { Delete, route as DeleteRoute } from './delete';
import { HonoConfig } from '../types';
import { authRequired } from '../util';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono<HonoConfig>();
const validateWithId = zValidator('param', z.object({ id: z.string() }));
const validateJson = zValidator('json', z.object({
	name: z.string(),
	description: z.string().optional(),
	slug: z.string(),
	participationCondition: z.number().optional(),
	iconUrl: z.string().optional(),
}));

app.openapi(IndexRoute, Index);
app.openapi(GetRoute, Get);
app.use(CreateRoute.getRoutingPath(), authRequired);
app.openapi(CreateRoute, Create);
app.use(UpdateRoute.getRoutingPath(), authRequired);
app.openapi(UpdateRoute, Update);
app.use(DeleteRoute.getRoutingPath(), authRequired);
app.openapi(DeleteRoute, Delete);

export default app;

type WITH_ID_URL = '/projects/:slug';
type WITHOUT_ID_URL = '/projects/';
export { WITH_ID_URL, WITHOUT_ID_URL};
