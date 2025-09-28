import {
  createRateLimiter,
  generalRateLimit,
  authRateLimit,
  setupSecurity,
} from '../middlewares/security';

describe('Security Middleware', () => {
  it('should export createRateLimiter', () => {
    expect(typeof createRateLimiter).toBe('function');
  });

  it('should export generalRateLimit', () => {
    expect(generalRateLimit).toBeDefined();
  });

  it('should export authRateLimit', () => {
    expect(authRateLimit).toBeDefined();
  });

  it('should export setupSecurity', () => {
    expect(typeof setupSecurity).toBe('function');
  });
});
