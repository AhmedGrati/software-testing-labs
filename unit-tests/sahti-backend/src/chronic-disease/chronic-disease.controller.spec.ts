import { Test, TestingModule } from '@nestjs/testing';
import { ChronicDiseaseController } from './chronic-disease.controller';
import { ChronicDiseaseService } from './chronic-disease.service';

describe('ChronicDiseaseController Test Suite', () => {
  let controller: ChronicDiseaseController;
  const mockChronicDiseaseService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChronicDiseaseController],
      providers: [ChronicDiseaseService],
    })
    .overrideProvider(ChronicDiseaseService)
    .useValue(mockChronicDiseaseService)
    .compile();

    controller = module.get<ChronicDiseaseController>(ChronicDiseaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
