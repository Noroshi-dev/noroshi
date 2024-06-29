import { DrizzleD1Database } from "drizzle-orm/d1";
import { userType } from "../schemas";

export type HonoConfig = {
  Bindings: {
    DB: D1Database;
    user: userType;
    token: string;
    drizzle: DrizzleD1Database;
    AUTH_GITHUB_CLIENT_ID: string;
    AUTH_GITHUB_CLIENT_SECRET: string;
    AUTH_GOOGLE_CLIENT_ID: string;
    AUTH_GOOGLE_CLIENT_SECRET: string;
    MY_BUCKET: R2Bucket;
    ASSETS_URL: string;
  };
};

export const ParticipationConditionType = {
  anyMember: 0,
  examination: 1,
  invitation: 2,
}

export const MemberRole = {
  owner: 0,
  manager: 1,
  member: 2,
  guest: 3,
}