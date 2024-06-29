import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HonoConfig } from '../types';
import { Create } from './create';
import { Delete } from './delete';
import { Index } from '.';

const app = new Hono<HonoConfig>();

const validateBase = { projectId: z.string(), channelId: z.string(), threadId: z.string(), messageId: z.string()};
const validateWithId = zValidator('param', z.object({...validateBase, ...{id: z.string() }}));
const validateWithoutId = zValidator('param', z.object(validateBase));

app.get('/', validateWithoutId, Index);
app.post('/', validateWithoutId, Create);
app.delete('/:id', validateWithId, Delete);

type WITHOUT_ID_URL = '/projects/:projectId/channels/:channelId/threads/:threadId/messages/:messageId/likes';
type WITH_ID_URL = `${WITHOUT_ID_URL}/:id`;
export { WITH_ID_URL, WITHOUT_ID_URL};

export default app;
