import { helpEmail, html } from '/lib/utils.ts';
import { PageContent } from '/lib/types.ts';

export const pageAction: PageContent = () => {
  return new Response('Not Implemented', { status: 501 });
};

export const pageContent: PageContent = () => {
  const htmlContent = html`
    <section class="main-section terms">
      <h1>Terms of Service</h1>
      <p>
      I'm Blue, Lda. (“Ask Soph”) utilizes state-of-the-art security and encryption technology to provide philosophy-related chatbot services to
      users worldwide. You agree to these Terms of Service (“Terms”) by
      installing or using the apps, services, or website (together, “Services”).
    </p>
    <h2>Summary</h2>
    <p>
      We hope you will read these entire terms. However, if you're in a hurry,
      here are the key points:
    </p>
    <ul className="common__line">
      <li>&mdash; We provide no warranties.</li>
      <li>&mdash; You can't try to harm us or our users.</li>
      <li>&mdash; You can't sue us.</li>
      <li>&mdash; You can't make us pay you anything.</li>
    </ul>

    <h2>About our services</h2>

    <p>
      <strong>Minimum Age.</strong> You must be at least 13 years old to use our
      Services. The minimum age to use our Services without parental approval
      may be higher in your home country.
    </p>

    <p>
      <strong>Account Registration.</strong> To create an account you must
      register for our Services using your email. You agree to receive emails
      (from us or our third-party providers) with confirmation of payment
      for our Services.
    </p>

    <p>
      <strong>Privacy of user data.</strong> Ask Soph does not sell, rent or
      monetize your personal data or content in any way &mdash; ever.
    </p>

    <p>
      Please read the <a href="/privacy">Privacy Policy</a>
      to understand how we safeguard the information you provide when using our
      Services. For the purpose of operating our Services, you agree to our data
      practices as described in our Privacy Policy, as well as the transfer of
      your encrypted information and metadata to the United Kingdom and other
      countries where we have or use facilities, service providers or partners.
      Examples would be Third Party Providers sending you a verification code
      and processing your support enquiries.
    </p>

    <p>
      <strong>Software.</strong> In order to enable new features and enhanced
      functionality, you consent to downloading and installing updates to our
      Services.
    </p>

    <p>
      <strong>Fees and Taxes.</strong> You are responsible for data and mobile
      carrier fees and taxes associated with the devices on which you use our
      Services.
    </p>

    <h2>Using Ask Soph</h2>

    <p>
      <strong>Our Terms and Policies.</strong> You must use our Services
      according to our Terms and posted policies. If we disable your account for
      a violation of our Terms, you will not create another account without our
      permission.
    </p>

    <p>
      <strong>Legal and Acceptable Use.</strong> You agree to use our Services
      only for legal, authorized, and acceptable purposes. You will not use (or
      assist others in using) our Services in ways that: (a) violate or infringe
      the rights of Ask Soph, our users, or others, including privacy, publicity,
      intellectual property, or other proprietary rights; (b) involve sending
      illegal or impermissible communications such as unrequested emails.
    </p>

    <p>
      <strong>Harm to Ask Soph.</strong> You must not (or assist others to)
      access, use, modify, distribute, transfer, or exploit our Services in
      unauthorized manners, or in ways that harm Ask Soph, our Services, or
      systems. For example you must not (a) gain or try to gain unauthorized
      access to our Services or systems; (b) disrupt the integrity or
      performance of our Services; (c) create accounts for our Services through
      unauthorized or automated means; (d) collect information about our users
      in any unauthorized manner; or (e) sell, rent, or charge for our Services.
    </p>

    <p>
      <strong>Keeping Your Account Secure.</strong> Ask Soph embraces privacy by
      design and does not have the ability to access your questions or bot answers. You are
      responsible for keeping your devices and your Ask Soph account safe and
      secure. If you lose your password and access to
      authorized devices, you can request us to delete your account, as the data
      can't be recovered.
    </p>

    <p>
      <strong>Third-party services.</strong> Our Services may allow you to
      access, use, or interact with third-party websites, apps, content, and
      other products and services. When you use third-party services, their
      terms and privacy policies govern your use of those services.
    </p>

    <h2>Your Rights and License with Ask Soph</h2>

    <p>
      <strong>Your Rights.</strong> You own the information you submit through
      our Services. You must have the rights to the email address you use to
      sign up for your Ask Soph account.
    </p>

    <p>
      <strong>Ask Soph's Rights.</strong> We own all copyrights, trademarks,
      domains, logos, trade dress, trade secrets, patents, and other
      intellectual property rights associated with our Services. You may not use
      our copyrights, trademarks, domains, logos, trade dress, patents, and
      other intellectual property rights unless you have our written permission.
      To report copyright, trademark, or other intellectual property
      infringement, please contact me@brunobernardino.com.
    </p>

    <p>
      <strong>Ask Soph's License to You.</strong> Ask Soph grants you a limited,
      revocable, non-exclusive, and non-transferable license to use our Services
      in accordance with these Terms.
    </p>

    <h2>Terms of Payment</h2>

    <p>Due to their nature, the paid Services provided by Ask Soph are generally non-refundable and any refunds or credits given will be at the sole discretion of Ask Soph. Paid accounts which are terminated due to a violation of these Terms will incur the loss of all payments and credits and are not eligible for refund.</p>

    <p>If Ask Soph chooses to issue a refund for any reason, it is only obligated to refund in the original currency of payment. If you request a credit balance to be converted between different currencies which it supports, it has discretion over the exchange rate applied.</p>

    <p>Payments are made one-time and valid for three months. There are no subscriptions or automatic renewals.</p>

    <p>If you fail to fulfill your obligation of payment as a user of a paid account, we may suspend your account or delete it after an extended period of default.</p>
    
    <p>If you rely on dispute or charge-back mechanisms of third-party payment processors and the result of that mechanism causes Ask Soph to be liable for an amount exceeding the price paid for the service (e.g. dispute fee), you authorize Ask Soph to charge that amount on your Account.</p>

    <h2>Disclaimers and Limitations</h2>

    <p>
      <strong>Disclaimers.</strong> YOU USE OUR SERVICES AT YOUR OWN RISK AND
      SUBJECT TO THE FOLLOWING DISCLAIMERS. WE PROVIDE OUR SERVICES ON AN “AS
      IS” BASIS WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
      LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
      PURPOSE, TITLE, NON-INFRINGEMENT, AND FREEDOM FROM COMPUTER VIRUS OR OTHER
      HARMFUL CODE. ASK SOPH DOES NOT WARRANT THAT ANY INFORMATION PROVIDED BY US
      IS ACCURATE, COMPLETE, OR USEFUL, THAT OUR SERVICES WILL BE OPERATIONAL,
      ERROR-FREE, SECURE, OR SAFE, OR THAT OUR SERVICES WILL FUNCTION WITHOUT
      DISRUPTIONS, DELAYS, OR IMPERFECTIONS. WE DO NOT CONTROL, AND ARE NOT
      RESPONSIBLE FOR, CONTROLLING HOW OR WHEN OUR USERS USE OUR SERVICES. WE
      ARE NOT RESPONSIBLE FOR THE ACTIONS OR INFORMATION (INCLUDING CONTENT) OF
      OUR USERS OR OTHER THIRD PARTIES. YOU RELEASE US, AFFILIATES, DIRECTORS,
      OFFICERS, EMPLOYEES, PARTNERS, AND AGENTS (TOGETHER, “ASK SOPH PARTIES”)
      FROM ANY CLAIM, COMPLAINT, CAUSE OF ACTION, CONTROVERSY, OR DISPUTE
      (TOGETHER, “CLAIM”) AND DAMAGES, KNOWN AND UNKNOWN, RELATING TO, ARISING
      OUT OF, OR IN ANY WAY CONNECTED WITH ANY SUCH CLAIM YOU HAVE AGAINST ANY
      THIRD PARTIES.
    </p>

    <p>
      <strong>Limitation of liability.</strong> THE ASK SOPH PARTIES WILL NOT BE
      LIABLE TO YOU FOR ANY LOST PROFITS OR CONSEQUENTIAL, SPECIAL, PUNITIVE,
      INDIRECT, OR INCIDENTAL DAMAGES RELATING TO, ARISING OUT OF, OR IN ANY WAY
      IN CONNECTION WITH OUR TERMS, US, OR OUR SERVICES, EVEN IF THE ASK SOPH
      PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR
      AGGREGATE LIABILITY RELATING TO, ARISING OUT OF, OR IN ANY WAY IN
      CONNECTION WITH OUR TERMS, US, OR OUR SERVICES WILL NOT EXCEED ONE HUNDRED
      DOLLARS ($100). THE FOREGOING DISCLAIMER OF CERTAIN DAMAGES AND LIMITATION
      OF LIABILITY WILL APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
      THE LAWS OF SOME STATES OR JURISDICTIONS MAY NOT ALLOW THE EXCLUSION OR
      LIMITATION OF CERTAIN DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND
      LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU. NOTWITHSTANDING ANYTHING
      TO THE CONTRARY IN OUR TERMS, IN SUCH CASES, THE LIABILITY OF THE ASK SOPH
      PARTIES WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
    </p>

    <p>
      <strong>Availability of Our Services.</strong> Our Services may be
      interrupted, including for maintenance, upgrades, or network or equipment
      failures. We may discontinue some or all of our Services, including
      certain features and the support for certain devices and platforms, at any
      time.
    </p>

    <h2>Resolving Disputes and Ending Terms</h2>

    <p>
      <strong>Resolving disputes.</strong> You agree to resolve any Claim you
      have with us relating to or arising out of our Terms, us, or our Services
      exclusively in the court of Porto, Portugal. You also agree to submit to
      the personal jurisdiction of such courts for the purpose of litigating all
      such disputes. The laws of Portugal govern our Terms, as well as any
      disputes, whether in court or arbitration, which might arise between
      Ask Soph and you, without regard to conflict of law provisions.
    </p>

    <p>
      <strong>Ending these Terms.</strong> You may end these Terms with Ask Soph
      at any time by deleting the app from your device and discontinuing use of
      our Services. We may modify, suspend, or terminate your access to or use
      of our Services anytime for any reason, such as if you violate the letter
      or spirit of our Terms or create harm, risk, or possible legal exposure
      for Ask Soph. The following provisions will survive termination of your
      relationship with Ask Soph: “Licenses,” “Disclaimers,” “Limitation of
      Liability,” “Resolving dispute,” “Availability” and “Ending these Terms,”
      and “General”.
    </p>

    <h2>General</h2>

    <p>
      Ask Soph may update the Terms from time to time. When we update our Terms,
      we will update the “updated on” date associated with the updated Terms.
      Your continued use of our Services confirms your acceptance of our updated
      Terms and supersedes any prior Terms. You will comply with all applicable
      export control and trade sanctions laws. Our Terms cover the entire
      agreement between you and Ask Soph regarding our Services. If you do not
      agree with our Terms, you should stop using our Services.
    </p>

    <p>
      If we fail to enforce any of our Terms, that does not mean we waive the
      right to enforce them. If any provision of the Terms is deemed unlawful,
      void, or unenforceable, that provision shall be deemed severable from our
      Terms and shall not affect the enforceability of the remaining provisions.
      Our Services are not intended for distribution to or use in any country
      where such distribution or use would violate local law or would subject us
      to any regulations in another country. We reserve the right to limit our
      Services in any country. If you have specific questions about these Terms,
      please contact us at ${helpEmail}.
    </p>

    <p>Effective as of August 5, 2023</p>
    </section>
  `;

  return {
    htmlContent,
    titlePrefix: 'Terms of Service',
    description: 'Learn about Terms of Service in Ask Soph.',
  };
};
