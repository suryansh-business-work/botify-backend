import request from 'supertest';
import app from '../../src/server';
import mongoose from 'mongoose';
import { BotModel } from '../../src/bots-api/bots.models';

let token: string;
let botId: string;

beforeAll(async () => {
  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNDAxMzc1Zi1mMjkyLTQ1MzUtYTQ5Yy0xMjA3N2JjZjE2NTYiLCJvcmdhbml6YXRpb25JZCI6ImE5ZjNiZTBlLWVjYTctNGU0OS04ZTA5LTQ4YTkwMTc1YTk3MCIsImlhdCI6MTc1MzQ2MTg0Mn0.iG8c1K5sr9R1pa28SVfKl_xN5tZvGAC8LxAi8GcOAeM';
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Bots API', () => {
  it('should create a bot', async () => {
    const res = await request(app)
      .post('/bot/create/bot')
      .set('Authorization', token)
      .send({
        name: 'Test Bot',
        description: 'A test bot',
        tags: ['test', 'bot'],
        category: { value: 'utility', label: 'Utility' }
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.bot).toHaveProperty('botId');
    botId = res.body.data.bot.botId;
  });

  it('should list bots by category', async () => {
    const res = await request(app)
      .post('/bot/bots')
      .set('Authorization', token)
      .send({});
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.bots)).toBe(true);
    expect(res.body.data.bots.some((b: any) => b.botId === botId)).toBe(true);
  });

  it('should get bot by id', async () => {
    const res = await request(app)
      .get(`/bot/bot-info/${botId}`)
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.bot.botId).toBe(botId);
  });

  it('should update bot', async () => {
    const res = await request(app)
      .patch(`/bot/update/bot/${botId}`)
      .set('Authorization', token)
      .send({ name: 'Updated Bot' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.bot.name).toBe('Updated Bot');
  });

  it('should delete bot', async () => {
    const res = await request(app)
      .delete(`/bot/delete/bot/${botId}`)
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    const deleted = await BotModel.findOne({ botId });
    expect(deleted).toBeNull();
  });
});
