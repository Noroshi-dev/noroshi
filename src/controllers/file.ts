import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class FileController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.post('/:fileName', this.post);
		app.delete('/:fileName', this.delete);
		return app;
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created file', { status: 201 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted file', { status: 200 });
	}
}
