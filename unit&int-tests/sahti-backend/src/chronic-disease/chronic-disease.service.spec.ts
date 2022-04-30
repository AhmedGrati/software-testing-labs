import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChronicDiseaseService } from './chronic-disease.service';
import { CreateChronicDiseaseDto } from './dto/create-chronic-disease.dto';
import { UpdateChronicDiseaseDto } from './dto/update-chronic-disease.dto';
import { ChronicDisease } from './entities/chronic-disease.entity';

describe('ChronicDiseaseService Test Suite', () => {
  let service: ChronicDiseaseService;
  const chronicDisease = new ChronicDisease();
  const chronicDiseases: ChronicDisease[] = [
    {id: 1, name: "diabetes"} as ChronicDisease,
    {id: 1, name: "arthritis"} as ChronicDisease,
    {id: 1, name: "asthma"} as ChronicDisease
  ]
  const chronicDiseasesNameList: string[] = [
    "diabetes",
    "arthritis",
    "asthma"
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
    delete: jest.fn().mockImplementation(
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
    expect(mockChronicDiseaseRepository.delete).toBeCalled();
    expect(await service.softDelete(chronicDiseaseId)).toEqual({});
  });

  it("should find a chronic disease by its name", async () => {
    const chronicDiseaseName = "asthma";
    expect(await service.findByName(chronicDiseaseName)).toBeDefined();
    expect(mockChronicDiseaseRepository.findOne).toBeCalled();
    expect(await service.findByName(chronicDiseaseName)).toEqual(chronicDisease);
  });

  it("should create a list of chronic diseases at once", async () => {
    const listOfChronicDiseases = [new ChronicDisease(), new ChronicDisease(), new ChronicDisease()];
    expect(await service.createMultipleChronicDiseases(chronicDiseasesNameList)).toBeDefined();
    expect(mockChronicDiseaseRepository.findOne).toBeCalled();
    expect(await service.createMultipleChronicDiseases(chronicDiseasesNameList)).toEqual(listOfChronicDiseases);
  });

  it("should update a chronic disease given its id and new name", async () => {
    const chronicDiseaseUpdateDto: UpdateChronicDiseaseDto = {name: "asthma"};
    const chronicDiseaseId = 1;
    const expectedResult = {id: 1, name: "asthma"};
    expect(await service.update(chronicDiseaseId, chronicDiseaseUpdateDto)).toBeDefined();
    expect(mockChronicDiseaseRepository.save).toBeCalled();
    expect(mockChronicDiseaseRepository.findOne).toBeCalled();
    expect(await service.update(chronicDiseaseId, chronicDiseaseUpdateDto)).toEqual(expectedResult);
  })

  test.each(cases)(
    "Create a chronic disease named $dto.name", async ({dto, expectedResult}) => {
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
