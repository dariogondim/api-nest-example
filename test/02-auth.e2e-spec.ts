import { INestApplication, Component } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as assert from 'assert';
import * as jwt from 'jsonwebtoken';

import { AuthModule } from './../src/modules/auth/auth.module';

describe('AuthController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ AuthModule ],
    }).compile();

    app = await moduleFixture.createNestApplication();
    await app.init();
  });

  // TESTE: AUTH MAIL INCORRETO
  it('/POST /auth/token', () => {
    return request(app.getHttpServer())
    .post('/auth/token')
    .send({
      mail: 'user@mail.com',
      password: '123456'
    })
    .expect(401);
  });

  // TESTE: PASSWORD INCORRETO
  it('/POST /auth/token', () => {
    return request(app.getHttpServer())
    .post('/auth/token')
    .send({
      mail: 'userone@mail.com',
      password: '654321'
    })
    .expect(401);
  });

  // TESTE: VALIDAÇAO DE MAIL E PASSWORD
  it('/POST /auth/token', () => {
    return request(app.getHttpServer())
    .post('/auth/token')
    .send({
      mail: '',
      password: ''
    })
    .expect(400);
  });
});