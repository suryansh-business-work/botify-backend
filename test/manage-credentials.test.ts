import request from 'supertest';
import { ManageCredential } from '../src/manage-credentials/manage-credentials.model';
import app from '../src/server';
import { disconnectDB } from '../db/db';
import mongoose from 'mongoose';

let token: string;
let credentialId: string;

beforeAll(async () => {
  token = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MmVlYmYwYS1hMDUzLTRjMWUtYjM5Ny1hYzE5NTljYTYzZTAiLCJvcmdhbml6YXRpb25JZCI6IjBhZjc4NmY0LWZhZTAtNGQ1MS1iNDA5LTFkNjFkMDJmMDhhNyIsImlhdCI6MTc1MzQ1NjI0NH0.rvNEnIfEaVx5Ya8ccnWLLTsDj9WTEAoj6QKX9n9nPVw';
});

describe('Manage Credentials API', () => {
  it('should create a credential', async () => {
    const res = await request(app)
      .post('/v1/api/manage-credentials')
      .set('Authorization', token)
      .send({
        name: 'Test Credential',
        type: 'apiKey',
        value: '123456',
        description: 'Test description'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('credentialId');
    credentialId = res.body.data.credentialId;
  });

  it('should get all credentials', async () => {
    const res = await request(app)
      .get('/v1/api/manage-credentials')
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get credential by id', async () => {
    const res = await request(app)
      .get(`/v1/api/manage-credentials/${credentialId}`)
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeTruthy(); 
    expect(res.body.data.credentialId).toBe(credentialId);
  });

  it('should update credential', async () => {
    const res = await request(app)
      .put(`/v1/api/manage-credentials/${credentialId}`)
      .set('Authorization', token)
      .send({
        name: 'Updated Credential',
        type: 'apiKey',
        value: '654321',
        description: 'Updated description'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Updated Credential');
  });

  it('should delete credential', async () => {
    const res = await request(app)
      .delete(`/v1/api/manage-credentials/${credentialId}`)
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    const deleted = await ManageCredential.findOne({ credentialId });
    expect(deleted).toBeNull();
  });
});

afterAll(async () => {
  await disconnectDB();
  await mongoose.connection.close();
});
