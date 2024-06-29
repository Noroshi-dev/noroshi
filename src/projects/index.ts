import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { WITHOUT_ID_URL } from './routes';
import { HonoConfig } from '../types';
import { projects } from '../schemas/schema-sqlite';
import { getModels } from '../schemas';

type Props = Context<HonoConfig, WITHOUT_ID_URL, {
	out: {
		param: {
			id: string;
		};
	};
}>

const Index = async (c: Props) => {
  try {
    const db = c.env.Drizzle;
    const { projects } =  getModels();
    const results = await db.select().from(projects).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ err: e }, 500);
  }
};

export { Index };
