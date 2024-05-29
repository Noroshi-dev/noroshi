import { Env, Hono, MiddlewareHandler } from "hono";

interface NoroshiInitOptions {
	databaseURI: string;
	appId: string;
	masterKey: string;
	serverURL: string;
	publicServerURL: string;
}

class Noroshi {
	constructor(options: NoroshiInitOptions) {
	}

	start(): Hono {
		const app = new Hono();
		Controller._noroshi = this;
		const userController = new NoroshiUserController();
		const cloudCodeController = new NoroshiCloudCodeController();

		app.route('/classes', new NoroshiObjectController().route());
		app.route('/users', userController.route());
		app.post('/login', userController.login);
		app.get('/login', userController.login);
		app.post('/logout', userController.logout);
		app.post('/requestPasswordReset', userController.requestPasswordReset);
		app.route('/sessions', new NoroshiSessionController().route());
		app.route('/roles', new NoroshiRoleController().route());
		app.route('/files', new NoroshiFileController().route());
		app.route('/events', new NorishiAnalyticsController().route());
		app.route('/push', new NoroshiPushController().route());
		app.route('/installations', new NoroshiInstallationsController().route());
		app.post('/functions/:name', cloudCodeController.run);
		app.post('/jobs/:name', cloudCodeController.job);
		app.route('/schemas', new NoroshiSchemaController().route());
		app.route('/hooks/functions', new NoroshiFunctionHookController().route());
		app.route('/hooks/triggers', new NoroshiTriggerHooksController().route());
		return app;
	}
}

class Controller {
	static _noroshi: Noroshi;
}

class NoroshiObjectController extends Controller {

	route(): Hono {
		const app = new Hono();
		app.get('/:className', this.index);
		app.get('/:className/:objectId', this.get);
		app.put('/:className/:objectId', this.put);
		app.delete('/:className/:objectId', this.delete);
		app.post('/:className', this.post);
		return app;
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get object', { status: 200 });
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get objects', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created object', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated object', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted object', { status: 200 });
	}

}

class NoroshiUserController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/', this.index);
		app.get('/:userId', this.get);
		app.get('/me', this.me);
		app.post('/', this.post);
		app.put('/:userId', this.put);
		app.delete('/:userId', this.delete);
		return app;
	}

	login: MiddlewareHandler = async (req, res) => {
		return new Response('Login', { status: 200 });
	}

	logout: MiddlewareHandler = async (req, res) => {
		return new Response('Logout', { status: 200 });
	}

	requestPasswordReset: MiddlewareHandler = async (req, res) => {
		return new Response('Request password reset', { status: 200 });
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get users', { status: 200 });
	}

	me: MiddlewareHandler = async (req, res) => {
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get user', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created user', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated user', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted user', { status: 200 });
	}
	
}

class NoroshiSessionController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/', this.index);
		app.get('/:sessionId', this.get);
		app.get('/me', this.me);
		app.post('/', this.post);
		app.put('/:sessionId', this.put);
		app.delete('/:sessionId', this.delete);
		app.put('/me', this.putMe);
		return app;
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get sessions', { status: 200 });
	}

	me: MiddlewareHandler = async (req, res) => {
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get session', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created session', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated session', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted session', { status: 200 });
	}

	putMe: MiddlewareHandler = async (req, res) => {
		return new Response('Updated session', { status: 200 });
	}
}

class NoroshiRoleController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/', this.post);
		app.get('/:roleId', this.get);
		app.put('/:roleId', this.put);
		app.delete('/:roleId', this.delete);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created role', { status: 201 });
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get role', { status: 200 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated role', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted role', { status: 200 });
	}

}

class NoroshiFileController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/:fileName', this.post);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created file', { status: 201 });
	}
}

class NorishiAnalyticsController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/AppOpened', this.post);
		app.post('/:eventName', this.customEvent);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created analytics', { status: 201 });
	}

	customEvent: MiddlewareHandler = async (req, res) => {
		return new Response('Custom event', { status: 200 });
	}
}

class NoroshiPushController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/', this.post);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Send push', { status: 200 });
	}
}

class NoroshiInstallationsController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/', this.post);
		app.get('/:objectId', this.get);
		app.get('/', this.index);
		app.put('/:objectId', this.put);
		app.delete('/:objectId', this.delete);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created installation', { status: 201 });
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get installation', { status: 200 });
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get installations', { status: 200 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated installation', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted installation', { status: 200 });
	}
}

class NoroshiCloudCodeController extends Controller {
	run: MiddlewareHandler = async (req, res) => {
		return new Response('Run cloud code', { status: 200 });
	}

	job: MiddlewareHandler = async (req, res) => {
		return new Response('Run job', { status: 200 });
	}
}

class NoroshiSchemaController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/', this.index);
		app.get('/:className', this.get);
		app.post('/:className', this.post);
		app.put('/:className', this.put);
		app.delete('/:className', this.delete);
		return app;
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get schema', { status: 200 });
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get schema', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created schema', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated schema', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted schema', { status: 200 });
	}
}

class NoroshiFunctionHookController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/:functionName', this.get);
		app.post('/', this.post);
		app.put('/:functionName', this.put);
		app.delete('/:functionName', this.delete);
		return app;
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get function', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created function', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated function', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted function', { status: 200 });
	}

}

class NoroshiTriggerHooksController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/:className/:triggerName', this.get);
		app.post('/', this.post);
		app.put('/:className/:triggerName', this.put);
		app.delete('/:className/:triggerName', this.delete);
		return app;
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get trigger', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created trigger', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated trigger', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted trigger', { status: 200 });
	}

}

export {
	Noroshi,
	
}

export type { NoroshiInitOptions }
