import { Chat, ChatMessage, PhilosopherId } from '/lib/types.ts';
import LocalData from './local-data.ts';

declare global {
  interface Window {
    app: App;
    Swal: any;
  }
}

export interface App {
  isLoggedIn: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  doLogout?: () => void;
}

export const QUESTION_LIMITS = {
  ANONYMOUS: 3,
  USER: 5,
  PAID: 250,
} as const;

// NOTE: Sort by born date (oldest to most recent)
export const PHILOSOPHERS: Readonly<{ id: PhilosopherId; name: string }[]> = [
  { id: 'ptahhotep', name: 'Ptahhotep' }, // 2500-2400 BC
  { id: 'laozi', name: 'Laozi' }, // 600-450 BC
  { id: 'kong-fuzi', name: 'Kong Fuzi' }, // 550-480 BC
  { id: 'sun-tzu', name: 'Sun Tzu' }, // 550-450 BC
  { id: 'socrates', name: 'Socrates' }, // 470-399 BC
  { id: 'aristotle', name: 'Aristotle' }, // 384-332 BC
  { id: 'al-farabi', name: 'al-Farabi' }, // 870-950
  { id: 'ibn-sina', name: 'Ibn Sina' }, // 980-1037
  { id: 'zera-yacob', name: 'Zera Yacob' }, // 1599-1692
  { id: 'friedrich-nietzsche', name: 'Friedrich Nietzsche' }, // 1844-1900
];

export function showNotification(message: string, type = 'success') {
  const { Swal } = window;

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: type === 'success' ? 2500 : 0,
    timerProgressBar: type === 'success',
    didOpen: (toast: any) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: type,
    title: message,
  });
}

export const commonRequestHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Accept': 'application/json; charset=utf-8',
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function showFormattedTime(
  stringDate: string,
) {
  const now = new Date();
  const date = new Date(stringDate);

  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();
  const dateHours = date.getHours();
  const dateMinutes = date.getMinutes();

  const monthName = months[dateMonth].substring(0, 3);
  const yearName = dateYear !== now.getFullYear() ? ` '${dateYear.toString().substring(2, 4)}` : '';

  return `${dateHours.toString().padStart(2, '0')}:${
    dateMinutes.toString().padStart(2, '0')
  }, ${dateDay} ${monthName}${yearName}`;
}

export function dateDiffInDays(startDate: Date, endDate: Date) {
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

export async function askSoph(chat: Chat, question: string) {
  try {
    const headers = commonRequestHeaders;

    const body: { chat: Chat; question: string } = {
      chat,
      question,
    };

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const { reply, success, error } = (await response.json()) as {
      reply: ChatMessage;
      success: boolean;
      error?: string;
    };

    if (!reply || !success) {
      if (error) {
        throw new Error(error);
      }
      throw new Error('Failed to send message. Please try again.');
    }

    // Update reference chat messages
    chat.messages.push(reply);

    // Update local data
    let existingSession = LocalData.get('session');

    if (existingSession?.chats) {
      const chosenChatIndex = existingSession.chats.findIndex((existingChat) => existingChat.id === chat.id);

      if (chosenChatIndex !== -1) {
        existingSession.chats[chosenChatIndex] = chat;
      } else {
        existingSession.chats.push(chat);
      }
    } else {
      existingSession = { chats: [chat] };
    }

    LocalData.set('session', existingSession);

    return { success: true, reply, chat };
  } catch (error) {
    console.log(error);

    // LocalData.clear();

    return { success: false, error };
  }
}
