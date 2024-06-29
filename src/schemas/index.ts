import { getType } from "../db/drizzle";
import {
	projects as SQLiteProjects,
	threads as SQLiteThreads,
	messages as SQLiteMessages,
	accounts as SQLiteAccounts,
	users as SQLiteUsers,
	sessions as SQLiteSessions,
	projectsMembers as SQLiteProjectsMembers,
} from "./schema-sqlite";


export const getModels = () => {
	const type = getType();
	switch (type) {
		case 'd1':
		case 'sqlite':
			return {
				projects: SQLiteProjects,
				threads: SQLiteThreads,
				messages: SQLiteMessages,
				accounts: SQLiteAccounts,
				users: SQLiteUsers,
				sessions: SQLiteSessions,
				projectsMembers: SQLiteProjectsMembers,
			};
	}
	throw new Error(`Unknown type, ${type}!`);
};

export type userType = {
  id?: number | null;
	username: string;
  displayName: string;
	email: string | null;
	emailVerified?: Date | null;
	iconUrl: string | null;
	passwordHash?: string | null;
	profile: string | null;
	projectsCount: number | null;
	threadsCount: number | null;
	messagesCount: number | null;
	votesCount: number | null;
	likesCount: number | null;
	followersCount: number | null;
	followsCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type accountType = {
	userId: number;
	provider: string;
	providerId: string;
	refreshToken: string | null;
	token: string | null;
};
