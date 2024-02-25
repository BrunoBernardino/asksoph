export interface PageContentResult {
  htmlContent: string;
  titlePrefix?: string;
  description?: string;
}

export type PageContent = (
  request: Request,
  match: URLPatternResult,
  context: { user?: User; session?: UserSession; ipAddress: string },
) => PageContentResult | Response | Promise<PageContentResult | Response>;

export interface User {
  id: string;
  email: string;
  hashed_password: string;
  subscription: {
    external: {
      stripe?: {
        user_id: string;
        payment_id: string;
      };
    };
    questions_available: number;
    expires_at: string;
    updated_at: string;
  };
  status: 'trial' | 'active' | 'inactive';
  extra: Record<never, never>; // NOTE: Here for potential future fields
  created_at: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  expires_at: Date;
  last_seen_at: Date;
  created_at: Date;
}

export interface AnonymousIp {
  id: string;
  ip: string;
  questions_available: number;
  expires_at: Date;
  last_seen_at: Date;
  created_at: Date;
}

export type PhilosopherId =
  | 'socrates'
  | 'aristotle'
  | 'sun-tzu'
  | 'laozi'
  | 'kong-fuzi'
  | 'ptahhotep'
  | 'ibn-sina'
  | 'al-farabi'
  | 'zera-yacob'
  | 'friedrich-nietzsche';

export interface Chat {
  id: string;
  messages: ChatMessage[];
  philosopherId: PhilosopherId;
  name?: string;
  created_at: string;
}

export interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
  created_at: string;
}
