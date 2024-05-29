import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class SessionController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/', this.index);
		app.get('/:sessionId', this.get);
		app.get('/me', this.me);
		app.post('/', this.post);
		app.put('/:sessionId', this.put);
		app.delete('/:sessionId', this.delete);
		app.put('/me', this.putMe);
		return app;
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get sessions', { status: 200 });
	}

	me: MiddlewareHandler = async (req, res) => {
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get session', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created session', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated session', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted session', { status: 200 });
	}

	putMe: MiddlewareHandler = async (req, res) => {
		return new Response('Updated session', { status: 200 });
	}
}
