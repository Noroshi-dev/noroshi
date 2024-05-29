import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class ConfigController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/', this.get);
		app.put('/', this.put);
		return app;
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get config', { status: 200 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated config', { status: 200 });
	}
}
