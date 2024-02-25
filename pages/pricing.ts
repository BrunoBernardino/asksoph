import { getFormDataField, html, STRIPE_PAYMENT_URL } from '/lib/utils.ts';
import { updateUser } from '/lib/data-utils.ts';
import { getCheckoutSessions as getStripeCheckoutSessions } from '/lib/providers/stripe.ts';
import { PageContent, User } from '/lib/types.ts';
import { QUESTION_LIMITS } from '/public/ts/utils.ts';

const titlePrefix = 'Pricing';

export const pageAction: PageContent = async (request, _match, { user }) => {
  if (request.method !== 'POST') {
    return new Response('Not Implemented', { status: 501 });
  }

  if (!user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/login` } });
  }

  let errorMessage = '';
  let notificationHtml = '';

  let formData = new FormData();

  try {
    formData = await request.formData();

    const provider: 'stripe' = getFormDataField(formData, 'provider') as 'stripe';

    if (!provider) {
      throw new Error(`Provider is required`);
    }

    const threeMonthsFromToday = new Date(new Date().setUTCMonth(new Date().getUTCMonth() + 3));

    if (provider === 'stripe') {
      const checkoutSessions = await getStripeCheckoutSessions();

      const checkoutSession = checkoutSessions.find((checkoutSession) =>
        checkoutSession.payment_status === 'paid' &&
        checkoutSession.customer.email === user.email &&
        checkoutSession.line_items.data.some((item) => item.price.id.startsWith('ask-soph-'))
      );

      if (checkoutSession) {
        user.subscription.updated_at = new Date().toISOString();
        user.subscription.expires_at = threeMonthsFromToday.toISOString();
        user.subscription.external.stripe = {
          user_id: checkoutSession.customer.id,
          payment_id: checkoutSession.id,
        };
        user.subscription.questions_available = user.subscription.questions_available + QUESTION_LIMITS.PAID;
        user.status = 'active';

        await updateUser(user);

        notificationHtml = html`
          <section class="notification-success">
            <h3>Payment processed!</h3>
            <p>Thank you for your support!</p>
          </section>
        `;
      }
    }
  } catch (error) {
    console.error(error);
    errorMessage = error.toString();
  }

  if (errorMessage) {
    notificationHtml = html`
      <section class="notification-error">
        <h3>Failed to find payment!</h3>
        <p>${errorMessage}</p>
      </section>
    `;
  }

  const htmlContent = defaultHtmlContent(user, notificationHtml);

  return {
    htmlContent,
    titlePrefix,
  };
};

export const pageContent: PageContent = (_request, _match, { user }) => {
  const htmlContent = defaultHtmlContent(user);

  return {
    htmlContent,
    titlePrefix,
  };
};

function defaultHtmlContent(user?: User, notificationHtml = '') {
  const buttonHtml = user
    ? html`
    <a class="button" href="${STRIPE_PAYMENT_URL}">
      Buy ${QUESTION_LIMITS.PAID} questions for €5
    </a>
  `
    : html`
    <a class="button" href="/login">
      Signup/login and buy ${QUESTION_LIMITS.PAID} questions for €5
    </a>
  `;
  const htmlContent = html`
    <section class="main-section">
      <h1>Pricing</h1>

      ${notificationHtml}

      <section class="hero">
        <p>Pricing is simple.</p>
        <p>
          You can <strong>ask ${QUESTION_LIMITS.ANONYMOUS} questions for free</strong> without signing up. If you sign up, <strong>you get ${QUESTION_LIMITS.USER} extra free questions</strong>, and then it's <strong>€5 / ${QUESTION_LIMITS.PAID} questions</strong>, valid for 3 months.
        </p>
      </section>
      <section class="buttons-wrapper">
        ${buttonHtml}
      </section>
    </section>
  `;

  return htmlContent;
}
