import Database, { sql } from '/lib/interfaces/database.ts';
import { getCheckoutSessions as getStripeCheckoutSessions } from '/lib/providers/stripe.ts';
import { updateUser } from '/lib/data-utils.ts';
import { User } from '/lib/types.ts';

const db = new Database();

export async function checkSubscriptions() {
  try {
    const users = await db.query<User>(
      sql`SELECT * FROM "asksoph_users" WHERE "status" IN ('active', 'trial')`,
    );

    let updatedUsers = 0;

    const threeMonthsFromToday = new Date(new Date().setUTCMonth(new Date().getUTCMonth() + 3));

    const now = new Date();

    const stripeCheckoutSessions = await getStripeCheckoutSessions();

    for (const checkoutSession of stripeCheckoutSessions) {
      // Skip unpaid sessions
      if (checkoutSession.payment_status !== 'paid') {
        continue;
      }

      // Skip payments that aren't related to Ask Soph
      if (!checkoutSession.line_items.data.some((item) => item.price.id.startsWith('ask-soph-'))) {
        continue;
      }

      const matchingUser = users.find((user) => user.email === checkoutSession.customer.email);

      if (matchingUser) {
        if (!matchingUser.subscription.external.stripe) {
          matchingUser.subscription.external.stripe = {
            user_id: checkoutSession.customer.id,
            payment_id: checkoutSession.id,
          };

          matchingUser.subscription.expires_at = threeMonthsFromToday.toISOString();
        }

        matchingUser.subscription.updated_at = now.toISOString();

        if (new Date(matchingUser.subscription.expires_at) > now) {
          matchingUser.status = 'active';
        } else {
          matchingUser.status = 'inactive';
        }

        await updateUser(matchingUser);

        ++updatedUsers;
      }
    }

    console.log('Updated', updatedUsers, 'users');
  } catch (error) {
    console.log(error);
  }
}
