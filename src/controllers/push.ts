import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class PushController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/', this.post);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Send push', { status: 200 });
	}
}
