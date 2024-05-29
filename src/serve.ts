import { Hono } from 'hono';
import { env } from 'hono/adapter';
const app = new Hono();
import { Noroshi, NoroshiInitOptions } from './';

const noroshi = new Noroshi({
	appId: 'myAppId',
	masterKey: 'myMasterKey',
	serverURL: `http://localhost:`,
} as NoroshiInitOptions);

app.route('/parse', noroshi.start());

export default app;
