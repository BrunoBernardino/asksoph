import { escapeHtml, generateHash, getFormDataField, helpEmail, html, validateEmail } from '/lib/utils.ts';
import { PageContent } from '/lib/types.ts';
import { createSessionResponse, PASSWORD_SALT } from '/lib/auth.ts';
import { createUser, getUserByEmail } from '/lib/data-utils.ts';

const titlePrefix = 'Login / Signup';

export const pageAction: PageContent = async (request, match, { user }) => {
  if (user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/` } });
  }

  let errorMessage = '';
  let notificationHtml = '';

  let formData = new FormData();

  let action: 'login' | 'signup' = 'login';

  try {
    formData = await request.formData();

    const email = getFormDataField(formData, 'email');

    if (!email) {
      throw new Error(`Email is required`);
    }

    if (!validateEmail(email)) {
      throw new Error(`Invalid email`);
    }

    const password = getFormDataField(formData, 'password');

    if (!password) {
      throw new Error(`Password is required`);
    }

    if (password.length < 6) {
      throw new Error(`Password is too short`);
    }

    const hashedPassword = await generateHash(`${password}:${PASSWORD_SALT}`, 'SHA-256');

    action = getFormDataField(formData, 'action') as typeof action;

    if (action !== 'login') {
      action = 'signup';
    }

    let user = await getUserByEmail(email);

    if (action === 'signup') {
      if (!user) {
        user = await createUser(email.toLowerCase().trim(), hashedPassword);
      } else {
        throw new Error('Email exists or invalid password.');
      }
    } else {
      if (!user || user.hashed_password !== hashedPassword) {
        throw new Error('Email not found or invalid password.');
      }
    }

    return createSessionResponse(request, match, user, { urlToRedirectTo: `/?success=${action}` });
  } catch (error) {
    console.error(error);
    errorMessage = error.toString();
  }

  if (errorMessage) {
    notificationHtml = html`
      <section class="notification-error">
        <h3>Failed to ${action}!</h3>
        <p>${errorMessage}</p>
      </section>
    `;
  }

  const htmlContent = defaultHtmlContent(formData, notificationHtml);

  return {
    htmlContent,
    titlePrefix,
  };
};

export const pageContent: PageContent = (_request, _match, { user }) => {
  if (user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/` } });
  }

  const htmlContent = defaultHtmlContent(new FormData());

  return {
    htmlContent,
    titlePrefix,
  };
};

function defaultHtmlContent(formData: FormData, notificationHtml = '') {
  const email = getFormDataField(formData, 'email');
  let action: 'login' | 'signup' = (getFormDataField(formData, 'action') || 'login') as 'login' | 'signup';

  if (action !== 'login') {
    action = 'signup';
  }

  const htmlContent = html`
    <section class="main-section">
      <h1>Login or Signup</h1>

      ${notificationHtml}

      <section class="hero">
        <form id="login-form" action="" method="POST">
          <input type="hidden" name="action" value="${escapeHtml(action)}" />
          <fieldset class="input-wrapper">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value="${escapeHtml(email)}"
              required
            />
          </fieldset>
          <fieldset class="input-wrapper">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="something secret"
              name="password"
              minlength="6"
              required
            />
          </fieldset>
          <div class="buttons-wrapper">
            <button type="submit" id="login-button">
              Login
            </button>
            <span class="or">or</span>
            <button type="button" id="signup-button">
              Signup
            </button>
          </div>
        </form>
      </section>
      <h2>Need help?</h2>
      <p>
        If you're having any issues or have any questions, <strong><a href="mailto:${helpEmail}">please reach out</a></strong>.
      </p>
    </section>

    <script src="/public/ts/login.ts" type="module"></script>
  `;

  return htmlContent;
}
