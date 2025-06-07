const request = require('supertest');
const fs = require('fs');
const path = require('path');

const TEST_DATA = path.join(__dirname, 'messages.test.json');

describe('server', () => {
  let app;

  beforeEach(() => {
    process.env.DATA_FILE = TEST_DATA;
    if (fs.existsSync(TEST_DATA)) fs.unlinkSync(TEST_DATA);
    jest.resetModules();
    app = require('../server');
  });

  afterEach(() => {
    delete process.env.DATA_FILE;
    if (fs.existsSync(TEST_DATA)) fs.unlinkSync(TEST_DATA);
  });

  test('GET /message returns empty object when no messages', async () => {
    const res = await request(app).get('/message');
    expect(res.body).toEqual({});
  });

  test('POST /sms stores message and GET /message returns it', async () => {
    await request(app)
      .post('/sms')
      .type('form')
      .send({ Body: 'Hello', From: '+123' })
      .expect(200);
    const res = await request(app).get('/message');
    expect(res.body.text).toBe('Hello');
    expect(res.body.from).toBe('+123');
  });
});
