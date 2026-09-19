export type Actor =
  | { type: 'anonymous'; id: string }
  | { type: 'user'; id: string; verificationTier: 1 };
