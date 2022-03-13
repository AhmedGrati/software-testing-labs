import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChronicDiseaseService } from './chronic-disease.service';
import { ChronicDisease } from './entities/chronic-disease.entity';

describe('ChronicDiseaseService Test Suite', () => {
  let service: ChronicDiseaseService;
  const mockChronicDiseaseRepository = {
    find: jest.fn().mockImplementation(
      () => {
        return [];
      }
    )
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChronicDiseaseService, {
        provide: getRepositoryToken(ChronicDisease),
        useValue: mockChronicDiseaseRepository
      }],
    })
    .compile();

    service = module.get<ChronicDiseaseService>(ChronicDiseaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return the list of all chronic diseases', async () => {
    expect(await service.findAll()).toBeDefined();
    expect(mockChronicDiseaseRepository.find).toBeCalled();
    expect(await service.findAll()).toEqual([]);
  });
});
