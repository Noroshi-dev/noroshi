import { Hono } from 'hono';
import { z } from 'zod';
import { Index } from './index';
import { Get } from './get';
import { zValidator } from '@hono/zod-validator';
import { Create } from './create';
import { Update } from './update';
import { Delete } from './delete';
import { HonoConfig } from '../types';
import { authRequired } from '../util';

const app = new Hono<HonoConfig>();
const validateWithId = zValidator('param', z.object({ id: z.string() }));
const validateJson = zValidator('json', z.object({ name: z.string(), description: z.string() }));

app.get('/', Index);
app.get('/:id', validateWithId, Get);
app.post('/', validateJson, authRequired, Create);
app.put('/:id', validateWithId, validateJson, Update);
app.delete('/:id', validateWithId, Delete);

export default app;

type WITH_ID_URL = '/projects/:projectId';
type WITHOUT_ID_URL = '/projects/';
export { WITH_ID_URL, WITHOUT_ID_URL};
