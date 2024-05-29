import { MiddlewareHandler } from "hono";
import { Controller } from ".";

export class CloudCodeController extends Controller {
	run: MiddlewareHandler = async (req, res) => {
		return new Response('Run cloud code', { status: 200 });
	}

	job: MiddlewareHandler = async (req, res) => {
		return new Response('Run job', { status: 200 });
	}
}
