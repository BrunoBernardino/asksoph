import { html } from '/lib/utils.ts';
import { deleteUser } from '/lib/data-utils.ts';
import { PageContent, User } from '/lib/types.ts';

const titlePrefix = 'Billing';

export const pageAction: PageContent = async (request, _match, { user }) => {
  if (request.method !== 'POST') {
    return new Response('Not Implemented', { status: 501 });
  }

  if (!user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/login` } });
  }

  let errorMessage = '';
  let notificationHtml = '';

  try {
    await deleteUser(user.id);
    return new Response('Redirect', { status: 302, headers: { 'Location': `/login?success=delete` } });
  } catch (error) {
    console.error(error);
    errorMessage = error.toString();
  }

  if (errorMessage) {
    notificationHtml = html`
      <section class="notification-error">
        <h3>Failed to delete account!</h3>
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
  if (!user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/login` } });
  }

  const htmlContent = defaultHtmlContent(user);

  return {
    htmlContent,
    titlePrefix,
  };
};

function defaultHtmlContent(user?: User, notificationHtml = '') {
  const payingHtml = user?.status === 'active'
    ? html`
    <section>
      <h2>Thank you so much for your support!</h2>
      <p>You currently have <strong>${user.subscription.questions_available}</strong> question${
      user.subscription.questions_available !== 1 ? 's' : ''
    } left to ask.</p>
      <p>You might want to check out the <a href="/pricing">pricing section</a> to buy some more.</p>
    </section>
  `
    : '';

  const trialingHtml = (user?.status === 'trial' || user?.status === 'inactive')
    ? html`
    <section>
      <h2>Thank you so much for giving it a try!</h2>
      <p>You currently have <strong>${user.subscription.questions_available}</strong> question${
      user.subscription.questions_available !== 1 ? 's' : ''
    } left to ask.</p>
      <p>You might want to check out the <a href="/pricing">pricing section</a> to buy some.</p>
    </section>
  `
    : '';

  const htmlContent = html`
    <section class="main-section">
      <h1>Billing</h1>
      ${notificationHtml}
      <section class="hero">
        <p>Billing is simple.</p>
        <p>Below, you can easily delete your account and check how many questions you've got left.</p>
      </section>
      <form id="billing-form" action="" method="POST">
        <h2>Delete your account</h2>
        <p>
          You can delete your account which will delete all your data.
        </p>
        <button class="delete-button" type="button" id="delete-account" style="margin: 2rem 0 1rem;">
          Delete account
        </button>
      </form>
      ${payingHtml}
      ${trialingHtml}
    </section>

    <script src="/public/ts/billing.ts" type="module"></script>
  `;

  return htmlContent;
}
