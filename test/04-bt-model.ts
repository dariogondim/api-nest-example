import { INestApplication, Component } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as assert from 'assert';

import { AuthModule } from './../src/modules/auth/auth.module';
import { BtModelModule } from './../src/modules/domain/bt-model/bt-model.module';
import { Token } from './../src/modules/auth/interfaces/token.interface';
import { token } from './01-user.e2e-spec';

describe('BtModelController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ BtModelModule, AuthModule ],
    }).compile();

    app = await moduleFixture.createNestApplication();
    await app.init();
  });

  // TESTE: INICIAR UM MODELO DE NEGOCIO
  it('/POST /models', () => {
    return request(app.getHttpServer())
    .post('/models')
    .set('Authorization', token)
    .send({
      valueOffer: 'Oferta de Valor',
      problemsOpportunities: 'Problemas e Oportunidades'
    })
    .expect(201);
  });

  // TESTE: EDITAR UM MODELO DE NEGOCIO
  it('/PUT /models/1', () => {
    return request(app.getHttpServer())
    .put('/models/1')
    .set('Authorization', token)
    .send({
        id: 1,
        valueOffer: 'Oferta de Valor Editado',
        problemsOpportunities: 'Problemas e Oportunidades Editado'
    })
    .expect(200);
  });

  // TESTE: VALIDAÇÃO DOS ATRIBUTOS DO MODELO DE NEGÓCIO
  it('/POST /models', () => {
    return request(app.getHttpServer())
    .post('/models')
    .set('Authorization', token)
    .send({
      valueOffer: '',
      problemsOpportunities: 'Problemas e Oportunidades'
    })
    .expect(400);
  });

  it('/POST /models', () => {
    return request(app.getHttpServer())
    .post('/models')
    .set('Authorization', token)
    .send({
      valueOffer: 'Oferta de Valor',
      problemsOpportunities: ''
    })
    .expect(400);
  });

  it('/POST /models', () => {
    return request(app.getHttpServer())
    .post('/models')
    .set('Authorization', token)
    .send({
      problemsOpportunities: 'Problemas e Oportunidades'
    })
    .expect(400);
  });

  it('/POST /models', () => {
    return request(app.getHttpServer())
    .post('/models')
    .set('Authorization', token)
    .send({
      valueOffer: 'Oferta de Valor',
    })
    .expect(400);
  });

  it('/POST /models', () => {
    return request(app.getHttpServer())
    .post('/models')
    .set('Authorization', token)
    .send({
      valueOffer: 'Oferta de Valor',
      problemsOpportunities: 'Problemas e Oportunidades',
      prop: 'Propriedade nao permitida'
    })
    .expect(400);
  });
});