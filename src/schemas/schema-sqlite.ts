import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name").notNull(),
	threadsCount: integer("threads_count").default(0),
	messagesCount: integer("messages_count").default(0),
	membersCount: integer("members_count").default(0),
	participationCondition: integer("participation_condition").default(0),
	description: text("description").default(""),
	iconUrl: text("icon_url").default(""),
  createdAt: text("created_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: text("updated_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const projectsMembers = sqliteTable("projects_members", {
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
  role: integer("role").default(0),
  createdAt: text("created_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: text("updated_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
}, (projectsMembers) => ({
  compoundKey: primaryKey(projectsMembers.projectId, projectsMembers.userId),
}));

export const threads = sqliteTable("threads", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
	projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
	messagesCount: integer("messages_count").default(0),
	membersCount: integer("members_count").default(0),
	readPermission: integer("view_permission").default(0),
	writePermission: integer("write_permission").default(1),
	description: text("description").default(""),
	iconUrl: text("icon_url").default(""),
  createdAt: text("created_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: text("updated_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const messages = sqliteTable("messages", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
	projectId: integer("project_id").notNull(),
	threadId: integer("thread_id").notNull(),
  title: text("title").notNull(),
	body: text("body").notNull(),
	userId: integer("user_id").notNull(),
	repliesCount: integer("replies_count").default(0),
	viewsCount: integer("views_count").default(0),
	votesCount: integer("votes_count").default(0),
	likesCount: integer("likes_count").default(0),
  createdAt: text("created_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: text("updated_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const users = sqliteTable("users", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
	username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
	email: text("email").default(""),
	emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
	iconUrl: text("icon_url").default(""),
	passwordHash: text("password_hash").default(""),
	profile: text("profile").default(""),
	projectsCount: integer("projects_count").default(0),
	threadsCount: integer("threads_count").default(0),
	messagesCount: integer("messages_count").default(0),
	votesCount: integer("votes_count").default(0),
	likesCount: integer("likes_count").default(0),
	followersCount: integer("followers_count").default(0),
	followsCount: integer("follows_count").default(0),
  createdAt: text("created_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: text("updated_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const accounts = sqliteTable("accounts", {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerId: text("provider_id").notNull(),
    refreshToken: text("refresh_token"),
    token: text("token"),
  }, (account) => ({
    compoundKey: primaryKey(account.provider, account.providerId),
  })
);

export const sessions = sqliteTable("sessions", {
  token: text("token").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});
