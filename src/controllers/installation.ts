import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class InstallationsController extends Controller {
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
