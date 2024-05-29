import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class SchemaController extends Controller {
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
