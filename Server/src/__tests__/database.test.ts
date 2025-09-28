import * as db from '../lib/database';

describe('Database module', () => {
  it('should export connectDatabase function', () => {
    expect(typeof db.connectDatabase).toBe('function');
  });

  it('should export disconnectDatabase function', () => {
    expect(typeof db.disconnectDatabase).toBe('function');
  });
});
