import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class UserController extends Controller {
	route(): Hono {
		const app = new Hono();
		app.get('/', this.index);
		app.get('/:userId', this.get);
		app.get('/me', this.me);
		app.post('/', this.post);
		app.put('/:userId', this.put);
		app.delete('/:userId', this.delete);
		return app;
	}

	login: MiddlewareHandler = async (req, res) => {
		return new Response('Login', { status: 200 });
	}

	loginAs: MiddlewareHandler = async (req, res) => {
		return new Response('Login as', { status: 200 });
	}

	logout: MiddlewareHandler = async (req, res) => {
		return new Response('Logout', { status: 200 });
	}

	requestPasswordReset: MiddlewareHandler = async (req, res) => {
		return new Response('Request password reset', { status: 200 });
	}

	verificationEmailRequest: MiddlewareHandler = async (req, res) => {
		return new Response('Verification email request', { status: 200 });
	}

	index: MiddlewareHandler = async (req, res) => {
		return new Response('Get users', { status: 200 });
	}

	me: MiddlewareHandler = async (req, res) => {
	}

	get: MiddlewareHandler = async (req, res) => {
		return new Response('Get user', { status: 200 });
	}

	post: MiddlewareHandler = async (req, res) => {
		return new Response('Created user', { status: 201 });
	}

	put: MiddlewareHandler = async (req, res) => {
		return new Response('Updated user', { status: 200 });
	}

	delete: MiddlewareHandler = async (req, res) => {
		return new Response('Deleted user', { status: 200 });
	}
	
}
