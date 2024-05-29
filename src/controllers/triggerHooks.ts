import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class TriggerHooksController extends Controller {
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
