
import { INestApplication, Component } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as assert from 'assert';

import { ProfileModule } from '../src/modules/domain/profile/profile.module';
import { AuthModule } from './../src/modules/auth/auth.module';

let token: string = '';

describe('ProfileController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ ProfileModule, AuthModule ],
    }).compile();

    app = await moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
    .post('/auth/test')
    .send({ mail: 'teste@mail.com', password: 'teste' });
    token = `Bearer ${res.body.access_token}`;
  });

  // TESTE: EDIÇÃO DE PROFILE DO USUARIO
  it('/PUT /profiles', () => {
    return request(app.getHttpServer())
    .put('/profiles')
    .set('Authorization', token)
    .send({
      name: 'User One Edited'
    })
    .expect(200);
  });

  // TESTE: VALIDAÇÃO DE ATRIBUTOS DE PROFILE DO USUARIO
  it('/POST /profiles', () => {
    return request(app.getHttpServer())
    .put('/profiles')
    .set('Authorization', token)
    .send({
      name: ''
    })
    .expect(400);
  });
});