import { html } from '/lib/utils.ts';
import { PageContent } from '/lib/types.ts';
import { PHILOSOPHERS, QUESTION_LIMITS, showFormattedTime } from '/public/ts/utils.ts';

export const pageAction: PageContent = () => {
  return new Response('Not Implemented', { status: 501 });
};

export const pageContent: PageContent = () => {
  const now = new Date();

  const philosoperOptionsHtml = html`
    ${PHILOSOPHERS.map((philosopher) => html`<option value="${philosopher.id}">${philosopher.name}</option>`).join('')}
  `;

  const htmlContent = html`
    <main class="chat">
      <section class="chats">
        <article class="bot">
          <section class="summary">
            <aside>Soph</aside>
            <time datetime="${now.toISOString()}" title="${now.toISOString()}">${
    showFormattedTime(now.toISOString())
  }</time>
          </section>
          <p>Hi, I'm Soph, a bot that will try to help you understand the work of a few dead philosophers.</p>
          <p>Currently I'm available on every device via web browser, and use OpenAI's API / Chat GPT (<a href="https://news.onbrn.com/announcing-asksoph-a-bot-to-ask-about-dead-philosophers" target="_blank" rel="noopener noreferrer">you can learn why in my announcement</a>).</p>
          <p>I don't store any data, and while OpenAI will, it won't be traceable to you.</p>
          <p>You can <strong>ask ${QUESTION_LIMITS.ANONYMOUS} questions for free</strong> without signing up. If you sign up, <strong>you get ${QUESTION_LIMITS.USER} extra free questions</strong>, and then it's <strong>€5 / ${QUESTION_LIMITS.PAID} questions</strong>, valid for 3 months.</p>
          <noscript><h1 style="color: red;">NOTE: You need to enable JavaScript for this app to work!</h1></noscript>
        </article>
        <section id="chat-messages">

        </section>
        <article class="bot hidden" id="bot-loading">
          <section class="summary">
            <aside>Soph</aside>
            <time>Just now</time>
          </section>
          <p>Thinking...</p>
        </article>
      </section>

      <form id="send-message-form" action="#" method="GET" class="hidden">
        <fieldset class="input-wrapper">
          <textarea
            id="message"
            placeholder="Ask Soph about Socrates..."
            name="message"
            required
          ></textarea>
        </fieldset>
        <section class="buttons-wrapper">
          <button type="submit" title="Shift + Enter automaticall sends the message">
            Send
          </button>
        </section>
      </form>

      <form id="choose-philosopher-form" action="#" method="GET">
        <fieldset class="input-wrapper">
          <label for="choose-chat">Choose a philosopher to chat about:</label>
          <select
            id="choose-philosopher"
            name="choose-philosopher"
          >
            ${philosoperOptionsHtml}
          </select>
        </fieldset>
        <section class="buttons-wrapper">
          <button type="submit">
            Choose
          </button>
        </section>
      </form>
    </main>

    <template id="chat-message">
      <article class="{message.from}">
        <section class="summary">
          <aside>{message.from}</aside>
          <time datetime="{message.created_at}">{message.created_at}</time>
        </section>
        <p>{message.text}</p>
      </article>
    </template>

    <script src="/public/ts/index.ts" type="module"></script>
  `;

  return {
    htmlContent,
    titlePrefix: '',
  };
};
