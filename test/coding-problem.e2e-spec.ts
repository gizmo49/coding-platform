// test/coding-problem.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/resources/app/app.module';
import { CodingProblemRepository } from '../src/resources/coding-problem/repository/coding-problem.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CodingProblemController (e2e)', () => {
  let app: INestApplication;
  let codingProblemRepository: CodingProblemRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    codingProblemRepository = moduleFixture.get(getRepositoryToken(CodingProblemRepository));
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET coding-problems', async () => {
    const codingProblems = [{ id: '1', title: 'Test Problem' }];
    jest.spyOn(codingProblemRepository, 'find').mockResolvedValue(codingProblems as any);

    const response = await request(app.getHttpServer()).get('/coding-problems').expect(200);

    expect(response.body).toEqual(codingProblems);
  });

  it('/POST coding-problems', async () => {
    const createCodingProblemDto = { title: 'New Problem', examples: [{ input: '1', output: '2' }] };
    const newProblem = { id: '1', ...createCodingProblemDto };
    jest.spyOn(codingProblemRepository, 'createCodingProblem').mockResolvedValue(newProblem as any);

    const response = await request(app.getHttpServer())
      .post('/coding-problems')
      .send(createCodingProblemDto)
      .expect(201);

    expect(response.body).toEqual(newProblem);
  });

  it('/PUT coding-problems/:id', async () => {
    const updateCodingProblemDto = { title: 'Updated Problem', examples: [{ input: '3', output: '4' }] };
    const updatedProblem = { id: '1', ...updateCodingProblemDto };
    jest.spyOn(codingProblemRepository, 'findOneOrFail').mockResolvedValue(updatedProblem as any);
    jest.spyOn(codingProblemRepository, 'save').mockResolvedValue(updatedProblem as any);

    const response = await request(app.getHttpServer())
      .put('/coding-problems/1')
      .send(updateCodingProblemDto)
      .expect(200);

    expect(response.body).toEqual(updatedProblem);
  });

  it('/GET coding-problems/:id', async () => {
    const codingProblem = { id: '1', title: 'Test Problem' };
    jest.spyOn(codingProblemRepository, 'findOneOrFail').mockResolvedValue(codingProblem as any);

    const response = await request(app.getHttpServer())
      .get('/coding-problems/1')
      .expect(200);

    expect(response.body).toEqual(codingProblem);
  });
});
