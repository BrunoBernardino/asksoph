import { PageContent } from '/lib/types.ts';
import { logoutUser } from '/lib/auth.ts';

export const pageAction: PageContent = () => {
  return new Response('Not Implemented', { status: 501 });
};

export const pageContent: PageContent = (request, match, { user }) => {
  if (!user) {
    return new Response('Redirect', { status: 302, headers: { 'Location': `/` } });
  }

  return logoutUser(request, match);
};
