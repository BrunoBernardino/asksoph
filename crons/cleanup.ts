import Database, { sql } from '/lib/interfaces/database.ts';
import { User } from '/lib/types.ts';

const db = new Database();

export async function cleanupAnonymousIps() {
  const sevenDaysAgo = new Date(new Date().setUTCDate(new Date().getUTCDate() - 7));

  try {
    const result = await db.query<{ count: number }>(
      sql`WITH "deleted" AS (
        DELETE FROM "asksoph_anonymous_ips" WHERE "expires_at" <= $1 RETURNING *
      )
        SELECT COUNT(*) FROM "deleted"`,
      [
        sevenDaysAgo.toISOString().substring(0, 10),
      ],
    );

    console.log('Deleted', result[0].count, 'anonymous ips');
  } catch (error) {
    console.log(error);
  }
}

export async function cleanupSessions() {
  const yesterday = new Date(new Date().setUTCDate(new Date().getUTCDate() - 1));

  try {
    const result = await db.query<{ count: number }>(
      sql`WITH "deleted" AS (
        DELETE FROM "asksoph_user_sessions" WHERE "expires_at" <= $1 RETURNING *
      )
        SELECT COUNT(*) FROM "deleted"`,
      [
        yesterday.toISOString().substring(0, 10),
      ],
    );

    console.log('Deleted', result[0].count, 'user sessions');
  } catch (error) {
    console.log(error);
  }
}

export async function cleanupInactiveUsers() {
  const sevenDaysAgo = new Date(new Date().setUTCDate(new Date().getUTCDate() - 7));

  try {
    const result = await db.query<Pick<User, 'id'>>(
      sql`SELECT "id" FROM "asksoph_users" WHERE "status" IN ('inactive', 'trial') AND "subscription" ->> 'expires_at' <= $1`,
      [
        sevenDaysAgo.toISOString().substring(0, 10),
      ],
    );

    const userIdsToDelete = result.map((user) => user.id);

    await db.query(
      sql`DELETE FROM "asksoph_user_sessions" WHERE "user_id" = ANY($1)`,
      [
        userIdsToDelete,
      ],
    );

    await db.query(
      sql`DELETE FROM "asksoph_users" WHERE "id" = ANY($1)`,
      [
        userIdsToDelete,
      ],
    );

    console.log('Deleted', userIdsToDelete.length, 'users');
  } catch (error) {
    console.log(error);
  }
}
