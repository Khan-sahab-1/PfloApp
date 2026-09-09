import {authenticateUser} from '../src/odoo_service';

describe('authenticateUser', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('normalizes a lowercase username and accepts a successful login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({result: {message: 'Login successful'}}),
    });

    await expect(
      authenticateUser('employee', 'password', 'https://example.com'),
    ).resolves.toBe(true);

    const request = global.fetch.mock.calls[0];
    expect(request[0]).toBe('https://example.com/attendance/login/v2');
    expect(JSON.parse(request[1].body).params.username).toBe('EMPLOYEE');
  });

  test('rejects invalid credentials', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({result: {message: 'Invalid login'}}),
    });

    await expect(
      authenticateUser('EMPLOYEE', 'wrong', 'https://example.com'),
    ).resolves.toBe(false);
  });

  test('returns false for an HTTP failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({ok: false});

    await expect(
      authenticateUser('EMPLOYEE', 'password', 'https://example.com'),
    ).resolves.toBe(false);
  });
});
