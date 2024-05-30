import { Context, Env, Hono, MiddlewareHandler } from "hono";
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
import { ServerController } from "./controllers/server";
import { getD1 } from "./databases/d1";
import { DrizzleD1Database } from "drizzle-orm/d1";

interface NoroshiInitOptions {
	appId: string;
	masterKey: string;
	serverURL: string;
	databaseURI: string;
	publicServerURL: string;
}

class Noroshi {
	appId: string;
	masterKey: string;
	serverURL: string;
	databaseURI: string;
	publicServerURL: string;
	database?: DrizzleD1Database;
	error?: any;

	constructor(options: NoroshiInitOptions) {
		if (!options.appId) throw new Error('appId is required');
		if (!options.masterKey) throw new Error('masterKey is required');
		if (!options.serverURL) throw new Error('serverURL is required');
		if (!options.databaseURI) throw new Error('databaseURI is required');

		this.appId = options.appId;
		this.masterKey = options.masterKey;
		this.serverURL = options.serverURL;
		this.databaseURI = options.databaseURI;
		this.publicServerURL = options.publicServerURL;
	}

	init(c: Context): boolean {
		if (!this.checkHeader(c)) return false;
		this.initDB(c.env);
		return true;
	}

	checkHeader(c: Context): boolean {
		if (this.appId !== c.req.header('X-Parse-Application-Id')) {
			this.error = {"error":"unauthorized"};
			return false;
		}
		return true;
	}

	initDB(env: any): boolean {
		const parser = new URL(this.databaseURI);
		switch (parser.protocol.toUpperCase()) {
			case 'D1:': // Cloudflare D1
				const dbName = parser.hostname;
				this.database = getD1(env[dbName]);
				return true;
		}
		throw new Error(`Database not supported ${this.databaseURI}`);
	}

	start(): Hono {
		const app = new Hono();
		Controller._noroshi = this;
		const userController = new UserController();
		const cloudCodeController = new CloudCodeController();
		const objectController = new ObjectController();
		const serverController = new ServerController();

		app.get('/health', serverController.health);
		app.get('/serverInfo', serverController.info);
		
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
