import { Chat, ChatMessage, PhilosopherId } from '/lib/types.ts';
import { askSoph, PHILOSOPHERS, showFormattedTime, showNotification } from './utils.ts';
import LocalData from './local-data.ts';

let chosenChat: Chat;

document.addEventListener('app-loaded', () => {
  const chooseChatSelect = document.getElementById('choose-chat') as HTMLSelectElement;
  const choosePhilosopherForm = document.getElementById('choose-philosopher-form') as HTMLFormElement;
  const choosePhilosopherSelect = document.getElementById('choose-philosopher') as HTMLSelectElement;
  const sendMessageForm = document.getElementById('send-message-form') as HTMLFormElement;
  const messagesList = document.getElementById('chat-messages') as HTMLDivElement;
  const firstBotMessageElement = document.querySelector('.chats article.bot') as HTMLDivElement;
  const sendMessageButton = sendMessageForm.querySelector('button')!;
  const sendMessageTextarea = sendMessageForm.querySelector('textarea')!;
  const botLoadingMessageElement = document.getElementById('bot-loading') as HTMLDivElement;
  const chatDropdownButton = document.getElementById('chat-dropdown-button') as HTMLButtonElement;
  const chatDropdown = document.getElementById('chat-dropdown') as HTMLDivElement;
  const renameChatOptionButton = document.getElementById('rename-chat-option-button') as HTMLButtonElement;
  const deleteChatOptionButton = document.getElementById('delete-chat-option-button') as HTMLButtonElement;
  const renameChatWrapper = document.getElementById('rename-chat-wrapper') as HTMLDivElement;
  const renameChatInput = document.getElementById('rename-chat') as HTMLInputElement;
  const renameChatButton = document.getElementById('rename-chat-button') as HTMLButtonElement;

  function getMessageHtmlElement(message: ChatMessage, index: number) {
    const template = document.getElementById('chat-message') as HTMLTemplateElement;

    const clonedElement = (template.content.firstElementChild as HTMLDivElement).cloneNode(true) as HTMLDivElement;
    clonedElement.dataset.index = index.toString();

    clonedElement.classList.add(message.from);

    const authorElement = clonedElement.querySelector('aside') as HTMLDivElement;
    authorElement.textContent = message.from === 'bot' ? 'Soph' : 'You';

    const dateElement = clonedElement.querySelector('time') as HTMLTimeElement;
    dateElement.textContent = showFormattedTime(message.created_at);
    dateElement.dateTime = message.created_at;
    dateElement.title = message.created_at;

    const textElement = clonedElement.querySelector('p') as HTMLParagraphElement;
    textElement.textContent = message.text;

    return clonedElement;
  }

  function showSophThinking() {
    botLoadingMessageElement.classList.remove('hidden');
    botLoadingMessageElement.scrollIntoView(false);
  }

  function hideSophThinking() {
    botLoadingMessageElement.classList.add('hidden');
  }

  function showMessages() {
    window.app.showLoading();

    messagesList.replaceChildren();

    // Change the initial bot timestap if we're loading in a previous chat
    if (chosenChat.messages.length > 0) {
      const firstChatMessageTimeElement = firstBotMessageElement.querySelector('time')!;
      firstChatMessageTimeElement.innerText = showFormattedTime(chosenChat.created_at);
      firstChatMessageTimeElement.dateTime = chosenChat.created_at;
      firstChatMessageTimeElement.title = chosenChat.created_at;
    }

    let messageIndex = -1;

    for (const message of chosenChat.messages) {
      const element = getMessageHtmlElement(message, ++messageIndex);

      messagesList.appendChild(element);
    }

    if (chosenChat.messages.length === 0) {
      messagesList.innerHTML = '<span class="no-data">There are no messages yet!</span>';
    }

    messagesList.scrollIntoView(false);

    window.app.hideLoading();
  }

  function showChats() {
    const { chats } = LocalData.get('session') || { chats: [] };

    chooseChatSelect.replaceChildren();

    for (const chat of chats) {
      const element = document.createElement('option');
      element.value = chat.id;
      element.innerText = chat.name || chat.id;

      chooseChatSelect.appendChild(element);
    }

    const element = document.createElement('option');
    element.value = 'new';
    element.innerText = 'Start new chat...';

    chooseChatSelect.appendChild(element);
  }

  function loadChat(chatId: string) {
    closeChatDropdown();

    if (chatId === 'new') {
      const newChat: Chat = {
        id: new Date().toISOString(),
        messages: [],
        philosopherId: 'socrates',
        created_at: new Date().toISOString(),
      };

      chosenChat = newChat;

      chooseChatSelect.value = 'new';

      choosePhilosopherForm.classList.remove('hidden');
      sendMessageForm.classList.add('hidden');
      chatDropdownButton.classList.add('hidden');

      showMessages();
      return;
    }

    const { chats } = LocalData.get('session') || { chats: [] };

    const foundChat = chats.find((chat) => chat.id === chatId);

    if (foundChat) {
      chosenChat = foundChat;
      chooseChatSelect.value = chosenChat.id;
      const philosopherName = PHILOSOPHERS.find((philosopher) => philosopher.id === chosenChat.philosopherId)!.name;

      if (chosenChat.messages.length > 0) {
        sendMessageTextarea.placeholder = `Ask Soph about ${philosopherName}...`;
        choosePhilosopherForm.classList.add('hidden');
        sendMessageForm.classList.remove('hidden');
        chatDropdownButton.classList.remove('hidden');
      } else {
        choosePhilosopherForm.classList.remove('hidden');
        sendMessageForm.classList.add('hidden');
        chatDropdownButton.classList.add('hidden');
      }

      showMessages();
    } else {
      showNotification('Could not find chat', 'error');
      loadChat('new');
    }
  }

  function initializePage() {
    showChats();

    loadChat('new');

    const urlSearchParams = new URLSearchParams(window.location.search);
    const successParam = urlSearchParams.get('success');

    if (successParam === 'login') {
      showNotification('Logged in successfully!', 'success');
      history.pushState(null, '', window.location.href.replace('?success=login', ''));
    } else if (successParam === 'signup') {
      showNotification('Signed up successfully!', 'success');
      history.pushState(null, '', window.location.href.replace('?success=signup', ''));
    }
  }

  let isSendingMessage = false;

  async function sendMessage(event: MouseEvent | SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (isSendingMessage) {
      return;
    }

    sendMessageButton.textContent = 'Sending...';
    isSendingMessage = true;

    const text = sendMessageTextarea.value;

    // Post message in UI
    const userMessage: ChatMessage = {
      from: 'user',
      text,
      created_at: new Date().toISOString(),
    };

    chosenChat.messages.push(userMessage);

    showMessages();

    showSophThinking();

    sendMessageButton.textContent = 'Waiting...';

    const { success, error } = await askSoph(chosenChat, text);

    if (success) {
      showChats();
      loadChat(chosenChat.id);
      sendMessageForm.reset();
    } else {
      showNotification(error, 'error');
    }

    hideSophThinking();
    isSendingMessage = false;
    sendMessageButton.textContent = 'Send';
  }

  async function choosePhilosopher(event: MouseEvent | SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!chosenChat) {
      loadChat('new');
      return;
    }

    // Only allow changing/setting once per chat
    if (chosenChat.messages.length === 0) {
      chosenChat.philosopherId = choosePhilosopherSelect.value as PhilosopherId;
      const philosopherName = PHILOSOPHERS.find((philosopher) => philosopher.id === chosenChat.philosopherId)!.name;

      // Post message in UI
      const userMessage: ChatMessage = {
        from: 'user',
        text: `Hi, I'd like to talk about ${philosopherName}.`,
        created_at: new Date().toISOString(),
      };

      chosenChat.messages.push(userMessage);

      showMessages();

      sendMessageTextarea.placeholder = `Ask Soph about ${philosopherName}...`;
      choosePhilosopherForm.classList.add('hidden');
      sendMessageForm.classList.remove('hidden');

      // Hack-ish, but works well and feels like an interaction, without using up a question. Without it, too many things happen too fast in the UI and can be confusing.
      await new Promise((resolve) => setTimeout(() => resolve(true), 500));

      // Post bot in UI
      const botMessage: ChatMessage = {
        from: 'bot',
        text: 'Sounds good! What would you like to know?',
        created_at: new Date().toISOString(),
      };

      chosenChat.messages.push(botMessage);

      showMessages();
    }
  }

  function openChatDropdown() {
    if (!chosenChat) {
      return;
    }

    chatDropdown.classList.remove('hidden');
    chatDropdownButton.classList.add('open');
  }

  function closeChatDropdown() {
    if (!chosenChat) {
      return;
    }

    chatDropdown.classList.add('hidden');
    chatDropdownButton.classList.remove('open');
  }

  function toggleChatDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    hideRenameChat();

    if (chatDropdown.classList.contains('hidden')) {
      openChatDropdown();
    } else {
      closeChatDropdown();
    }
  }

  function showRenameChat(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    closeChatDropdown();
    renameChatWrapper.classList.remove('hidden');
    renameChatInput.focus();
  }

  function hideRenameChat() {
    renameChatWrapper.classList.add('hidden');
  }

  function renameChat(event: MouseEvent | SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!chosenChat) {
      loadChat('new');
      return;
    }

    const normalizedName = renameChatInput.value.normalize().trim();

    if (!normalizedName) {
      showNotification('A non-empty name is required.', 'error');
      return;
    }

    chosenChat.name = normalizedName;

    // Update local data
    const existingSession = LocalData.get('session');

    if (existingSession?.chats) {
      const chosenChatIndex = existingSession.chats.findIndex((existingChat) => existingChat.id === chosenChat.id);

      if (chosenChatIndex !== -1) {
        existingSession.chats[chosenChatIndex] = chosenChat;
      } else {
        showNotification('Cannot find chat in local storage.', 'error');
        return;
      }
    } else {
      showNotification('Cannot find chat in local storage.', 'error');
      return;
    }

    LocalData.set('session', existingSession);

    renameChatInput.value = '';
    renameChatInput.blur();

    showChats();
    loadChat(chosenChat.id);
    hideRenameChat();
  }

  async function deleteChat(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!chosenChat) {
      return;
    }

    const { Swal } = window;

    const confirmDialogResult = await Swal.fire({
      icon: 'warning',
      title: 'Confirm delete?',
      text: `Are you sure you want to delete this chat? You will lose all the questions and answers.`,
      focusConfirm: false,
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: 'Yes, delete!',
      cancelButtonText: 'Wait, cancel.',
    });

    if (!confirmDialogResult.isDenied) {
      closeChatDropdown();
      return;
    }

    // Update local data
    const existingSession = LocalData.get('session');

    if (existingSession?.chats) {
      const chosenChatIndex = existingSession.chats.findIndex((existingChat) => existingChat.id === chosenChat.id);

      if (chosenChatIndex !== -1) {
        existingSession.chats.splice(chosenChatIndex, 1);
      } else {
        showNotification('Cannot find chat in local storage.', 'error');
        return;
      }
    } else {
      showNotification('Cannot find chat in local storage.', 'error');
      return;
    }

    LocalData.set('session', existingSession);

    showChats();
    loadChat('new');
  }

  initializePage();

  sendMessageForm.addEventListener('submit', sendMessage);
  chooseChatSelect.addEventListener('change', () => loadChat(chooseChatSelect.value));
  choosePhilosopherForm.addEventListener('submit', choosePhilosopher);
  chatDropdownButton.addEventListener('click', toggleChatDropdown);
  renameChatOptionButton.addEventListener('click', showRenameChat);
  deleteChatOptionButton.addEventListener('click', deleteChat);
  renameChatButton.addEventListener('click', renameChat);
  renameChatInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      renameChatButton.dispatchEvent(new CustomEvent('click'));
    }
  });
  sendMessageTextarea.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      sendMessage(new MouseEvent('click'));
    }
  });
});
