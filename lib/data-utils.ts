import Database, { sql } from './interfaces/database.ts';
import { AnonymousIp, User, UserSession } from './types.ts';
import { QUESTION_LIMITS } from '/public/ts/utils.ts';

const db = new Database();

export const monthRegExp = new RegExp(/^\d{4}\-\d{2}$/);

export async function getUserByEmail(email: string) {
  const lowercaseEmail = email.toLowerCase().trim();

  const user = (await db.query<User>(sql`SELECT * FROM "asksoph_users" WHERE "email" = $1 LIMIT 1`, [
    lowercaseEmail,
  ]))[0];

  return user;
}

export async function getUserById(id: string) {
  const user = (await db.query<User>(sql`SELECT * FROM "asksoph_users" WHERE "id" = $1 LIMIT 1`, [
    id,
  ]))[0];

  return user;
}

export async function createUser(email: User['email'], hashedPassword: User['hashed_password']) {
  const trialDays = 30;
  const now = new Date();
  const trialEndDate = new Date(new Date().setUTCDate(new Date().getUTCDate() + trialDays));

  const subscription: User['subscription'] = {
    questions_available: QUESTION_LIMITS.USER,
    external: {},
    expires_at: trialEndDate.toISOString(),
    updated_at: now.toISOString(),
  };

  const newUser = (await db.query<User>(
    sql`INSERT INTO "asksoph_users" (
      "email",
      "subscription",
      "status",
      "hashed_password",
      "extra"
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      email,
      JSON.stringify(subscription),
      'trial',
      hashedPassword,
      JSON.stringify({}),
    ],
  ))[0];

  return newUser;
}

export async function updateUser(user: User) {
  await db.query(
    sql`UPDATE "asksoph_users" SET
        "email" = $2,
        "subscription" = $3,
        "status" = $4,
        "hashed_password" = $5,
        "extra" = $6
      WHERE "id" = $1`,
    [
      user.id,
      user.email,
      JSON.stringify(user.subscription),
      user.status,
      user.hashed_password,
      JSON.stringify(user.extra),
    ],
  );
}

export async function deleteUser(userId: string) {
  await db.query(
    sql`DELETE FROM "asksoph_user_sessions" WHERE "user_id" = $1`,
    [
      userId,
    ],
  );

  await db.query(
    sql`DELETE FROM "asksoph_users" WHERE "id" = $1`,
    [
      userId,
    ],
  );
}

export async function getSessionById(id: string) {
  const session = (await db.query<UserSession>(
    sql`SELECT * FROM "asksoph_user_sessions" WHERE "id" = $1 AND "expires_at" > now() LIMIT 1`,
    [
      id,
    ],
  ))[0];

  return session;
}

export async function createUserSession(user: User) {
  // Add new user session to the db
  const oneMonthFromToday = new Date(new Date().setUTCMonth(new Date().getUTCMonth() + 1));

  const newSession: Omit<UserSession, 'id' | 'created_at'> = {
    user_id: user.id,
    expires_at: oneMonthFromToday,
    last_seen_at: new Date(),
  };

  const newUserSessionResult = (await db.query<UserSession>(
    sql`INSERT INTO "asksoph_user_sessions" (
      "user_id",
      "expires_at",
      "last_seen_at"
    ) VALUES ($1, $2, $3)
      RETURNING *`,
    [
      newSession.user_id,
      newSession.expires_at,
      newSession.last_seen_at,
    ],
  ))[0];

  return newUserSessionResult;
}

export async function updateSession(session: UserSession) {
  await db.query(
    sql`UPDATE "asksoph_user_sessions" SET
        "expires_at" = $2,
        "last_seen_at" = $3
      WHERE "id" = $1`,
    [
      session.id,
      session.expires_at,
      session.last_seen_at,
    ],
  );
}

export async function deleteUserSession(sessionId: string) {
  await db.query(
    sql`DELETE FROM "asksoph_user_sessions" WHERE "id" = $1`,
    [
      sessionId,
    ],
  );
}

export async function validateUserAndSession(userId: string, sessionId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('Not Found');
  }

  const session = await getSessionById(sessionId);

  if (!session || session.user_id !== user.id) {
    throw new Error('Not Found');
  }

  const oneMonthFromToday = new Date(new Date().setUTCMonth(new Date().getUTCMonth() + 1));

  session.last_seen_at = new Date();
  session.expires_at = oneMonthFromToday;

  await updateSession(session);

  return { user, session };
}

async function getAnonymousIp(ipAddress: string) {
  const anonymousIp = (await db.query<AnonymousIp>(
    sql`SELECT * FROM "asksoph_anonymous_ips" WHERE "ip" = $1 AND "expires_at" > now() LIMIT 1`,
    [
      ipAddress,
    ],
  ))[0];

  return anonymousIp;
}

async function createAnonymousIp(ipAddress: string) {
  const threeMonthsFromToday = new Date(new Date().setUTCMonth(new Date().getUTCMonth() + 3));

  const newAnonymousIp: Omit<AnonymousIp, 'id' | 'created_at'> = {
    ip: ipAddress,
    expires_at: threeMonthsFromToday,
    questions_available: QUESTION_LIMITS.ANONYMOUS,
    last_seen_at: new Date(),
  };

  const newAnonymousIpResult = (await db.query<AnonymousIp>(
    sql`INSERT INTO "asksoph_anonymous_ips" (
      "ip",
      "expires_at",
      "questions_available",
      "last_seen_at"
    ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
    [
      newAnonymousIp.ip,
      newAnonymousIp.expires_at,
      newAnonymousIp.questions_available,
      newAnonymousIp.last_seen_at,
    ],
  ))[0];

  return newAnonymousIpResult;
}

export async function updateAnonymousIp(anonymousIp: AnonymousIp) {
  await db.query(
    sql`UPDATE "asksoph_anonymous_ips" SET
        "expires_at" = $2,
        "questions_available" = $3,
        "last_seen_at" = $4
      WHERE "id" = $1`,
    [
      anonymousIp.id,
      anonymousIp.expires_at,
      anonymousIp.questions_available,
      anonymousIp.last_seen_at,
    ],
  );
}

export async function deleteAnonymousIp(anonymousIpId: string) {
  await db.query(
    sql`DELETE FROM "asksoph_anonymous_ips" WHERE "id" = $1`,
    [
      anonymousIpId,
    ],
  );
}

export async function validateAndDecrementQuestionCount(userIdOrIpAddress: string) {
  if (!userIdOrIpAddress.includes('.')) {
    const user = await getUserById(userIdOrIpAddress);

    if (user) {
      if (user.subscription.questions_available === 0) {
        throw new Error('Not enough questions available. Please buy some.');
      }

      user.subscription.questions_available -= 1;

      await updateUser(user);
      return;
    }
  }

  let anonymousIp = await getAnonymousIp(userIdOrIpAddress);

  if (!anonymousIp) {
    anonymousIp = await createAnonymousIp(userIdOrIpAddress);
  }

  if (anonymousIp.questions_available === 0) {
    throw new Error('Not enough questions available. Please sign up and buy some.');
  }

  anonymousIp.questions_available -= 1;
  anonymousIp.last_seen_at = new Date();

  await updateAnonymousIp(anonymousIp);
}

export async function revertQuestionCount(userIdOrIpAddress: string) {
  if (!userIdOrIpAddress.includes('.')) {
    const user = await getUserById(userIdOrIpAddress);

    if (user) {
      user.subscription.questions_available += 1;

      await updateUser(user);
      return;
    }
  }

  let anonymousIp = await getAnonymousIp(userIdOrIpAddress);

  if (!anonymousIp) {
    anonymousIp = await createAnonymousIp(userIdOrIpAddress);
  }

  anonymousIp.questions_available += 1;
  anonymousIp.last_seen_at = new Date();

  await updateAnonymousIp(anonymousIp);
}
