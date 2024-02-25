import { Chat, ChatMessage, PageContent } from '/lib/types.ts';
import { revertQuestionCount, validateAndDecrementQuestionCount } from '/lib/data-utils.ts';
import { getAnswerForQuestion } from '/lib/chat-utils.ts';

export const pageAction: PageContent = async (request, _match, { user, ipAddress }) => {
  if (request.method !== 'POST') {
    return new Response('Not Implemented', { status: 501 });
  }

  const { chat, question }: { chat: Chat; question: string } = await request.json();

  if (!chat || !question || !chat.messages || !Array.isArray(chat.messages)) {
    return new Response('Bad Request', { status: 400 });
  }

  try {
    await validateAndDecrementQuestionCount(user?.id || ipAddress);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || error.toString(), success: false }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const answer = await getAnswerForQuestion(chat.philosopherId, question, chat.messages);

  if (!answer) {
    await revertQuestionCount(user?.id || ipAddress);

    return new Response(
      JSON.stringify({ error: 'Soph was not able to come up with an answer, please try again!', success: false }),
      {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  }

  const reply: ChatMessage = {
    from: 'bot',
    text: answer,
    created_at: new Date().toISOString(),
  };

  return new Response(JSON.stringify({ reply, success: true }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};

export function pageContent() {
  return new Response('Not Implemented', { status: 501 });
}
