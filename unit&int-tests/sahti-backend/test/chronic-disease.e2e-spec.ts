import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateChronicDiseaseDto } from 'src/chronic-disease/dto/create-chronic-disease.dto';
import { UpdateChronicDiseaseDto } from 'src/chronic-disease/dto/update-chronic-disease.dto';
import exp from 'constants';
describe('Chronic Diseases Controller(e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  })

  it('/chronic-diseases (POST)', async () => {
    const chronicDiseaseDTO: CreateChronicDiseaseDto = {
        name: "Sample Chronic Disease"
    }
    const expectedChronicDisease = {
      id: 1,
      name: "Sample Chronic Disease"
    }
    return request(app.getHttpServer())
      .post('/chronic-diseases')
      .send(chronicDiseaseDTO)
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject(expectedChronicDisease);
      });
  })
  it('/chronic-diseases (POST)', async () => {
    const chronicDiseaseDTO: CreateChronicDiseaseDto = {
        name: "Another Sample Chronic Disease"
    }
    const expectedChronicDisease = {
      id: 2,
      name: "Another Sample Chronic Disease"
    }
    return request(app.getHttpServer())
      .post('/chronic-diseases')
      .send(chronicDiseaseDTO)
      .expect(201)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body).toMatchObject(expectedChronicDisease);
      });
  });
  it('/chronic-diseases (GET)', async () => {
    const expectedResult = [
      {
        id: 1,
        name: "Sample Chronic Disease"
      }, 
      {
        id: 2,
        name: "Another Sample Chronic Disease"
      }
    ]
    return request(app.getHttpServer())
      .get('/chronic-diseases')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(2);
        expect(res.body).toEqual(expectedResult);
      });
  });
  it('/chronic-dieases/:id (Delete)', async () => {
    return request(app.getHttpServer())
      .delete(`/chronic-diseases/2`)
      .expect(200);
  });
  it('/chronic-diseases/:id (Patch)', async () => {
    const updateChronicDisease: UpdateChronicDiseaseDto = {
      name: "Updated Sample Chronic Disease"
    };
    const expectedResult = {
      id: 1,
      name: "Updated Sample Chronic Disease"
    }
    return request(app.getHttpServer())
      .patch('/chronic-diseases/1')
      .send(updateChronicDisease)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body).toMatchObject(expectedResult);
      })
  });

  it('/chronic-diseases (Get)', async () => {
    const expectedResult = [
      {
        id: 1,
        name: "Updated Sample Chronic Disease"
      }
    ];
    return request(app.getHttpServer())
      .get('/chronic-diseases/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(1);
        expect(res.body).toEqual(expectedResult);
      })
  });
});
