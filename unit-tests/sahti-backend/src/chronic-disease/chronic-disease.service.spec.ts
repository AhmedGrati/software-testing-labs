import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChronicDiseaseService } from './chronic-disease.service';
import { CreateChronicDiseaseDto } from './dto/create-chronic-disease.dto';
import { ChronicDisease } from './entities/chronic-disease.entity';

describe('ChronicDiseaseService Test Suite', () => {
  let service: ChronicDiseaseService;
  const chronicDisease = new ChronicDisease();
  const chronicDiseases: ChronicDisease[] = [
    {name: "diabetes"} as ChronicDisease,
    {name: "arthritis"} as ChronicDisease,
    {name: "asthma"} as ChronicDisease
  ]
  const cases = [
    {dto: {name:"diabetes" }, expectedResult: chronicDiseases[0]},
    {dto: {name:"arthritis" }, expectedResult: chronicDiseases[1]},
    {dto: {name:"asthma" }, expectedResult: chronicDiseases[2]},
  ];
  const mockChronicDiseaseRepository = {
    find: jest.fn().mockImplementation(
      () => {
        return [];
      }
    ),
    findOne: jest.fn().mockImplementation(
      () => {
        return chronicDisease;
      }
    ),
    save: jest.fn().mockImplementation(
      (dto) => {
        return {id: 1, ...dto};
      }
    ),
    create: jest.fn().mockImplementation(
      (dto: CreateChronicDiseaseDto) => {
        return {...dto};
      }
    ),
    softDelete: jest.fn().mockImplementation(
      (id) => {
        return {};
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

  it("should return a chronic disease given its id", async () => {
    const chronicDiseaseId = 1;
    expect(await service.findOne(chronicDiseaseId)).toBeDefined();
    expect(mockChronicDiseaseRepository.findOne).toBeCalled();
    expect(await service.findOne(chronicDiseaseId)).toEqual(chronicDisease);
  });

  it("should soft delete a chronic disease given its id", async () => {
    const chronicDiseaseId = 1;
    expect(await service.softDelete(chronicDiseaseId)).toBeDefined();
    expect(mockChronicDiseaseRepository.softDelete).toBeCalled();
    expect(await service.softDelete(chronicDiseaseId)).toEqual({});
  });

  it("should find a chronic disease by its name", async () => {
    const chronicDiseaseName = "asthma";
    expect(await service.findByName(chronicDiseaseName)).toBeDefined();
    expect(mockChronicDiseaseRepository.findOne).toBeCalled();
    expect(await service.findByName(chronicDiseaseName)).toEqual(chronicDisease);
  });
  
  test.each(cases)(
    "Create a chronic disease named ${dto.name}", async ({dto, expectedResult}) => {
      const chronicDiseaseId = 1;
      expect(await service.create(dto)).toBeDefined();
      expect(mockChronicDiseaseRepository.save).toBeCalled();
      expect(mockChronicDiseaseRepository.create).toBeCalled();
      expect(await service.create(dto)).toEqual(
        {id: chronicDiseaseId, ...dto}
      );
    }
  )
});
