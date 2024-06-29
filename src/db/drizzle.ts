import { config } from '../../drizzle.config';
import { drizzle as D1Drizzle} from "drizzle-orm/d1";
import { drizzle as SqliteDrizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as PostgresDrizzle } from 'drizzle-orm/node-postgres';
import { drizzle as MySQLDrizzle } from "drizzle-orm/planetscale-serverless";

export const getType = (): string => {
	if ('driver' in config && config.driver === "d1-http") {
		return 'd1';
	}
	if (config.dialect === "sqlite") {
		if ('url' in config.dbCredentials && config.dbCredentials.url.match(/\.\/\.wrangler\/state\/v3\/d1\//)) {
			return 'd1';
		} else {
			return 'sqlite';
		}
	}
	if (config.dialect === "postgresql") {
		return 'postgres'
	}
	if (config.dialect === "mysql") {
		return 'mysql';
	}
	throw new Error(`Unknown dialect, ${config.dialect}!`);
};

export const getDrizzle = () => {
	const type = getType();
	if (type === 'd1') {
		return D1Drizzle;
	}
	if (type === 'sqlite') {
		return SqliteDrizzle;
	}
	if (type === 'postgres') {
		return PostgresDrizzle;
	}
	if (type === 'mysql') {
		return MySQLDrizzle;
	}
	throw new Error(`Unknown type, ${type}!`);
};
