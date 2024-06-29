import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
// import { Index } from './index';
import { Me } from './get';
// import { Create } from './create';
// import { Update } from './update';
// import { Delete } from './delete';
import { HonoConfig } from '../types';
import { authRequired } from '../util';
import { Create } from './create';
import { Delete } from './delete';

const app = new Hono<HonoConfig>();
const validateWithId = zValidator('param', z.object({ id: z.string() }));
const validateJsonCreate = zValidator('json', 
	z.object({
		username: z.string(),
		password: z.string(),
		displayName: z.string().optional(),
		email: z.string().optional(),
	}));

app.get('/me', authRequired, Me);
// app.get('/', Index);
// app.get('/:id', validateWithId, Get);
app.post('/', validateJsonCreate, Create);
app.delete('/', authRequired, Delete);
// app.put('/:id', validateWithId, validateJson, Update);
// app.delete('/:id', validateWithId, Delete);

export default app;

type WITH_ID_URL = '/users/:id';
type WITHOUT_ID_URL = '/users/';
export { WITH_ID_URL, WITHOUT_ID_URL};
