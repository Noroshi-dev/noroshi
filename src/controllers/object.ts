import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class ObjectController extends Controller {

	route(): Hono {
		const app = new Hono();
		app.get('/:className', this.index);
		app.get('/:className/:objectId', this.get);
		app.put('/:className/:objectId', this.put);
		app.delete('/:className/:objectId', this.delete);
		app.post('/:className', this.post);
		return app;
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get object', { status: 200 });
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get objects', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created object', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated object', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted object', { status: 200 });
	}

	batch: MiddlewareHandler = async (req, res) => {
		return new Response('Batch object', { status: 200 });
	}

	aggregate: MiddlewareHandler = async (req, res) => {
		return new Response('Aggregate object', { status: 200 });
	}
}
