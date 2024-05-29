import { Env, Hono, MiddlewareHandler } from "hono";
import { Controller } from "./controllers";
import { CloudCodeController } from "./controllers/cloudCode";
import { FileController } from "./controllers/file";
import { InstallationsController } from "./controllers/installation";
import { ObjectController } from "./controllers/object";
import { PushController } from "./controllers/push";
import { RoleController } from "./controllers/role";
import { SchemaController } from "./controllers/schema";
import { SessionController } from "./controllers/session";
import { TriggerHooksController } from "./controllers/triggerHooks";
import { UserController } from "./controllers/user";
import { AnalyticsController } from "./controllers/analytics";
import { FunctionHooksController } from "./controllers/functionHooks";
import { ConfigController } from "./controllers/config";

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
		const userController = new UserController();
		const cloudCodeController = new CloudCodeController();
		const objectController = new ObjectController();

		app.route('/classes', objectController.route());
		app.post('/batch', objectController.batch);
		app.get('/aggregate/:className', objectController.aggregate);

		app.route('/users', userController.route());
		app.post('/login', userController.login);
		app.get('/login', userController.login);
		app.post('/loginAs', userController.loginAs);
		app.post('/logout', userController.logout);
		app.post('/requestPasswordReset', userController.requestPasswordReset);
		app.post('/verificationEmailRequest', userController.verificationEmailRequest);
		app.route('/sessions', new SessionController().route());
		app.route('/roles', new RoleController().route());
		app.route('/files', new FileController().route());
		app.route('/events', new AnalyticsController().route());
		app.route('/push', new PushController().route());
		app.route('/installations', new InstallationsController().route());
		app.route('/config', new ConfigController().route());
		app.post('/functions/:name', cloudCodeController.run);
		app.post('/jobs/:name', cloudCodeController.job);
		app.route('/schemas', new SchemaController().route());
		app.route('/hooks/functions', new FunctionHooksController().route());
		app.route('/hooks/triggers', new TriggerHooksController().route());
		return app;
	}
}

export {
	Noroshi,
	
}

export type { NoroshiInitOptions }
