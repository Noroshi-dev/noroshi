import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";


export class RoleController extends Controller {
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
