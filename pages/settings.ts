import { escapeHtml, generateHash, getFormDataField, html, validateEmail } from '/lib/utils.ts';
import { getUserByEmail, updateUser } from '/lib/data-utils.ts';
import { PASSWORD_SALT } from '/lib/auth.ts';
import { PageContent } from '/lib/types.ts';

const titlePrefix = 'Settings';

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

    const email = getFormDataField(formData, 'email');

    if (email) {
      const existingUserByEmail = await getUserByEmail(email);

      if (existingUserByEmail || !validateEmail(email)) {
        throw new Error('Email is invalid or already exists!');
      }

      user.email = email;
    }

    const oldPassword = getFormDataField(formData, 'old_password');
    const newPassword = getFormDataField(formData, 'new_password');

    if (oldPassword && newPassword) {
      const hashedOldPassword = await generateHash(`${oldPassword}:${PASSWORD_SALT}`, 'SHA-256');
      const hashedNewPassword = await generateHash(`${newPassword}:${PASSWORD_SALT}`, 'SHA-256');

      if (hashedOldPassword !== user.hashed_password) {
        throw new Error('Password mismatch!');
      }

      user.hashed_password = hashedNewPassword;
    }

    if (email || (oldPassword && newPassword)) {
      await updateUser(user);

      notificationHtml = html`
        <section class="notification-success">
          <h3>Updated settings successfully!</h3>
          <p>Your email/password was updated.</p>
        </section>
      `;
    } else {
      throw new Error('Nothing to update!');
    }
  } catch (error) {
    console.error(error);
    errorMessage = error.toString();
  }

  if (errorMessage) {
    notificationHtml = html`
      <section class="notification-error">
        <h3>Failed to update settings!</h3>
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
  if (!user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/login` } });
  }

  const htmlContent = defaultHtmlContent(new FormData());

  return {
    htmlContent,
    titlePrefix,
  };
};

function defaultHtmlContent(formData: FormData, notificationHtml = '') {
  const email = getFormDataField(formData, 'email');

  const htmlContent = html`
    <section class="main-section">
      <h1>Settings</h1>

      ${notificationHtml}

      <section>
        <h2>Change Email</h2>
        <p>
          When you change your email or password, you'll need to login in other devices again.
        </p>
        <form id="change-email-form" action="" method="POST">
          <fieldset class="input-wrapper">
            <label for="new-email">New Email</label>
            <input
              id="new-email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value="${escapeHtml(email)}"
            />
          </fieldset>
          <button type="submit" id="change-email-button">
            Change email
          </button>
        </form>
      </section>

      <section style="margin-top: 2rem">
        <h2>Change Password</h2>
        <form id="change-password-form" action="" method="POST">
          <fieldset class="input-wrapper">
            <label for="current-password">Current Password</label>
            <input
              id="current-password"
              type="password"
              placeholder="something secret"
              name="old_password"
            />
          </fieldset>
          <fieldset class="input-wrapper">
            <label for="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="something even more secret"
              name="new_password"
            />
          </fieldset>
          <button type="submit" id="change-password-button">
            Change password
          </button>
        </form>
      </section>

      <section style="margin-top: 2rem">
        <h2>Delete account</h2>
        <p>
          You can delete your account from the <a href="/billing">billing section</a>.
        </p>
      </section>
    </section>
  `;

  return htmlContent;
}
