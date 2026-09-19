import { canBuildTrust, canSubmitReport } from './actor-policy';
import { Actor } from './actor.types';

describe('actor policy', () => {
  const anonymousActor: Actor = { type: 'anonymous', id: 'anonymous-1' };
  const userActor: Actor = { type: 'user', id: 'user-1', verificationTier: 1 };

  it('allows anonymous actors to submit reports', () => {
    expect(canSubmitReport(anonymousActor)).toBe(true);
  });

  it('allows account actors to submit reports', () => {
    expect(canSubmitReport(userActor)).toBe(true);
  });

  it('does not allow an anonymous actor to build trust', () => {
    expect(canBuildTrust(anonymousActor)).toBe(false);
  });

  it('allows an account actor to build trust', () => {
    expect(canBuildTrust(userActor)).toBe(true);
  });
});
