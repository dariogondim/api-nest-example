import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as assert from 'assert';
import * as jwt from 'jsonwebtoken';

import { AuthModule } from './../src/modules/auth/auth.module';
import { UserModule } from '../src/modules/domain/user/user.module';

describe('UserController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ UserModule, AuthModule ],
    }).compile();

    app = await moduleFixture.createNestApplication();
    await app.init();
  });

  // TESTE: INSERÇÃO DE NOVO USUARIO COM SUCESSO
  it('/POST /users', async () => {
    const res = await request(app.getHttpServer())
    .post('/users')
    .send({
      name: 'User Two',
      mail: 'usertwo@mail.com',
      password: '123456',
    });
    expect(res.body).toMatchObject({
      userId: 2,
    });
  });

  // TESTE: AUTENTICAÇAO DE USUARIO
  it('/POST /auth/token', () => {
    return request(app.getHttpServer())
    .post('/auth/token')
    .send({
      mail: 'usertwo@mail.com',
      password: '123456'
    })
    .then( res => {
      expect(res.ok).toBeTruthy();
    });
  });
});
