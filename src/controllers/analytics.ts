import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class AnalyticsController extends Controller {
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
