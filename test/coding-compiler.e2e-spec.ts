// test/coding-compiler.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/resources/app/app.module';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios'; // Make sure to import AxiosResponse


describe('CodingCompilerController (e2e)', () => {
    let app: INestApplication;
    let httpService: HttpService;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      httpService = moduleFixture.get(HttpService);
  
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    it('should execute code and return result', async () => {
      const apiResponse: AxiosResponse = {
        data: {
          stdout: 'Hello World',
          stderr: '',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
  
      jest.spyOn(httpService, 'post').mockReturnValue(of(apiResponse));
  
      // Line where `send` method is used
      const response = await request(app.getHttpServer())
        .post('/execute-code')
        .send({
          language: 'javascript', // Line 34
          code: 'console.log("Hello World");', // Line 35
        }) // End of `send` method
        .expect(200); // Line 37
  
      expect(response.body).toEqual(apiResponse.data); // Line 39
    });
  });