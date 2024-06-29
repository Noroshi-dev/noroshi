import { Context, Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HonoConfig } from '../types';
import { Create } from './create';
import { Index } from '.';
import { Delete } from './delete';
import { Get } from './get';
import { Update } from './update';

const app = new Hono<HonoConfig>();

const validateBase = { projectId: z.string() };
const validateWithId = zValidator('param', z.object({ ...validateBase, ...{id: z.string() }}));
const validateWithoutId = zValidator('param', z.object(validateBase));
const validateJson = zValidator('json', z.object({ name: z.string(), description: z.string() }))
// Channels
app.get('/', validateWithoutId, Index);
app.get('/:id', validateWithId, Get);
app.post('/', validateWithoutId, validateJson, Create);
app.put('/:id', validateWithId, validateJson, Update);
app.delete('/:id', validateWithId, Delete);

type WITHOUT_ID_URL = '/projects/:projectId/channels';
type WITH_ID_URL = `${WITHOUT_ID_URL}/:id`;
export { WITH_ID_URL, WITHOUT_ID_URL};

export default app;