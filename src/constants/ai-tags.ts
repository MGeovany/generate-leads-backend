export const AI_TAGS = [
  'greeting',
  'pricing_request',
  'info_request',
  'complaint',
  'thanks',
  'spam',
  'other',
] as const;

export type AiTag = (typeof AI_TAGS)[number];
