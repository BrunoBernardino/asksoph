import { helpEmail, html } from '/lib/utils.ts';
import { PageContent } from '/lib/types.ts';

export const pageAction: PageContent = () => {
  return new Response('Not Implemented', { status: 501 });
};

export const pageContent: PageContent = () => {
  const htmlContent = html`
    <section class="main-section privacy">
      <h1>Privacy Policy</h1>
      <p>
        This privacy policy explains how I'm Blue, Lda. (“Ask Soph”) processes your
        personal information when you use the apps, services, or website
        (together, “Services”).
      </p>
      <h2>Summary</h2>
      <p>
        We hope you will read this entire privacy policy. However, if you're in a
        hurry, here are the key points:
      </p>
      <ul>
        <li>
          &mdash; We won't sell or rent your data or content for any reason.
        </li>
        <li>
          &mdash; We don't access, sell, transmit, or use your bot conversations.
        </li>
        <li>
          &mdash; We use <a href="https://openai.com/policies/privacy-policy">OpenAI</a> for question and answer processing.
        </li>
        <li>
          &mdash; We can only see your email, when you create your account, and if
          you are a paying customer, your last payment date and last 4 digits of
          your payment method.
        </li>
        <li>
          &mdash; We use <a href="https://stripe.com/privacy">Stripe</a> for payment processing.
        </li>
      </ul>

      <p>
        Ask Soph utilizes state-of-the-art security and encryption technology to
        provide philosophy-related chatbot services to users worldwide (“Services”).
        Your questions and answers are only stored in your local devices, so they can never be shared or viewed by
        anyone but yourself and others you may share your device with. Note OpenAI does have the possibility of storing this information.
      </p>

      <h2>Information you provide</h2>

      <p>
        <strong>Account Information.</strong> You provide an email when you create
        a Ask Soph account. That email is used to provide the Services to you. Your
        email address is not end-to-end encrypted. We also store the timestamp
        (date and time with timezone) of when the account was registered. That
        information is also not end-to-end encrypted. Your password is hashed and never stored in an non-hashed format.
      </p>

      <p>
        <strong>Questions and Answers.</strong> We do not store or have access to the questions or answers our bot provides. Note OpenAI does have the possibility of storing this information.
      </p>

      <p>
        <strong>Interactions with us.</strong> If you email us, We may keep the
        content of your message, your email address, and your contact information
        to respond to the request and otherwise follow up as necessary. It'll be
        deleted as soon as your problem is solved.
      </p>

      <p>
        <strong>Managing your information.</strong> You can manage your personal
        information in the app. For example, you can update your email or password.
      </p>

      <h2>Information we may share</h2>

      <p>
        <strong>Third Parties.</strong> We work with third parties to provide some
        of the Services. For example, Stripe stores your email on when you
        signup. These providers are bound by their Privacy Policies to safeguard
        that information. These include 
        <a href="https://stripe.com/privacy">Stripe</a>, and <a href="https://openai.com/policies/privacy-policy">OpenAI</a>. Their Privacy
        Policies apply when their services are used.
      </p>

      <h2>Other instances where we may need to share your data</h2>

      <ul>
        <li>
          &mdash; To meet any applicable law, regulation, legal process or
          enforceable governmental request.
        </li>
        <li>
          &mdash; To enforce applicable Terms, including investigation of
          potential violations.
        </li>
        <li>
          &mdash; To detect, prevent, or otherwise address fraud, security, or
          technical issues.
        </li>
        <li>
          &mdash; To protect against harm to the rights, property, or safety of
          Ask Soph, its users, or the public as required or permitted by law.
        </li>
      </ul>

      <h2>Updates</h2>

      <p>
        We will update this privacy policy as needed so that it is current,
        accurate, and as clear as possible. Your continued use of the Services
        confirms your acceptance of this updated Privacy Policy.
      </p>

      <h2>Terms</h2>

      <p>
        Please also read the
        <a href="/terms">Terms</a>
        which also governs the terms of this Privacy Policy.
      </p>

      <h2>Contact us</h2>

      <p>
        If you have questions about this Privacy Policy please contact us at ${helpEmail}.
      </p>

      <p>Effective as of August 5, 2023</p>
    </section>
  `;

  return {
    htmlContent,
    titlePrefix: 'Privacy Policy',
    description: 'Learn about Privacy in Ask Soph.',
  };
};
