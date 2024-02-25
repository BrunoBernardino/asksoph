import { helpEmail, html } from '/lib/utils.ts';
import { User, UserSession } from '/lib/types.ts';

export default function menu(currentPath: string, user?: User, _session?: UserSession) {
  const loggedInHtml = user
    ? html`
    <a href="/billing">Billing</a>
    <a href="/settings">Settings</a>
    <a href="/logout">Logout</a>
  `
    : '';

  const loggedOutHtml = !user
    ? html`
    <a href="/login">Login / Signup</a>
  `
    : '';

  const chatListHtml = (currentPath === '/')
    ? html`
    <fieldset class="input-wrapper">
      <label for="choose-chat">Choose a previous chat:</label>
      <section class="dropdown-button-wrapper">
        <select
          id="choose-chat"
          name="choose-chat"
        >
        </select>
        <button type="button" id="chat-dropdown-button" class="hidden unstyled"><img src="/public/images/arrow-dropdown.svg" alt="chevron facing down with a circle around it" title="Rename or remove this chat" width="18" /></button>
      </section>
      <aside id="chat-dropdown" class="hidden">
        <button type="button" id="rename-chat-option-button" class="unstyled">Rename chat</button>
        <button type="button" id="delete-chat-option-button" class="unstyled">Delete chat</button>
      </aside>
    </fieldset>
    <fieldset class="input-wrapper hidden" id="rename-chat-wrapper">
      <label for="rename-chat">Rename chat:</label>
      <input
        id="rename-chat"
        type="text"
        placeholder="Something memorable"
        name="rename-chat"
      />
      <button type="button" id="rename-chat-button">
        Rename
      </button>
    </fieldset>
  `
    : '';

  return html`
    <aside id="left-panel">
      <h1>
        <a href="/">
          <img alt="Logo: A circle with a chipset and the words 'Ask Soph'" src="/public/images/logo.svg" />
        </a>
      </h1>
      ${chatListHtml}
      <nav>
        ${currentPath !== '/' ? html`<a href="/">Chat</a>` : ''}
        <a href="/pricing">Pricing</a>
        ${loggedOutHtml}
        ${loggedInHtml}
      </nav>
      <footer>
        <a href="https://news.onbrn.com/announcing-asksoph-a-bot-to-ask-about-dead-philosophers" target="_blank" rel="noopener noreferrer">About</a>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="mailto:${helpEmail}">Get Help</a>
        <span>Made in <img src="/public/images/european-union.svg" alt="European Union" title="Europe" width="16" /> by <a href="https://brunobernardino.com" target="_blank" rel="noopener noreferrer">Bruno Bernardino</a></span>
      </footer>
    </aside>
  `;
}
