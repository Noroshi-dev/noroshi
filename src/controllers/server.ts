import { Hono, MiddlewareHandler } from "hono";
import { Controller } from ".";

export class ServerController extends Controller {
	health: MiddlewareHandler = async (c, next) => {
		return c.json({"status":"ok"});
	}

	info: MiddlewareHandler = async (c, next) => {
		if (!ServerController._noroshi.init(c)) {
			return c.json(ServerController._noroshi.error);
		}
		return new Response('Info', { status: 201 });
	}
}
