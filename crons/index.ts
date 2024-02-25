import { Cron } from 'https://deno.land/x/croner@8.0.0/dist/croner.js';

import { checkSubscriptions } from './check-subscriptions.ts';
import { cleanupAnonymousIps, cleanupInactiveUsers, cleanupSessions } from './cleanup.ts';

export function startCrons() {
  new Cron(
    // At 04:07 every day.
    '7 4 * * *',
    {
      name: 'check-subscriptions',
      protect: true,
    },
    async () => {
      await checkSubscriptions();
    },
  );

  new Cron(
    // At 03:06 every day.
    '6 3 * * *',
    {
      name: 'cleanup',
      protect: true,
    },
    async () => {
      await cleanupInactiveUsers();

      await cleanupSessions();

      await cleanupAnonymousIps();
    },
  );
  console.log('Crons starting...');
}
