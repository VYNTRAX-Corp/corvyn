import { Actor } from './actor.types';

export function canSubmitReport(actor: Actor | undefined): boolean {
  return actor !== undefined;
}

export function canBuildTrust(actor: Actor): boolean {
  return actor.type === 'user';
}
