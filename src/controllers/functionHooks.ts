import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class FunctionHooksController extends Controller {
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
