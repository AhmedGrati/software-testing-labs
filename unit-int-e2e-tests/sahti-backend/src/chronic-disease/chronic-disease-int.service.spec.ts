
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import exp from 'constants';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { ChronicDiseaseService } from './chronic-disease.service';
import { CreateChronicDiseaseDto } from './dto/create-chronic-disease.dto';
import { UpdateChronicDiseaseDto } from './dto/update-chronic-disease.dto';
import { ChronicDisease } from './entities/chronic-disease.entity';

describe('ChronicDiseaseService Test Suite', () => {
  let service: ChronicDiseaseService;
  let repository: Repository<ChronicDisease>;
  const chronicDisease = new ChronicDisease();
  const chronicDiseases: ChronicDisease[] = [
    {id: 1, name: "diabetes"} as ChronicDisease,
    {id: 2, name: "arthritis"} as ChronicDisease,
    {id: 3, name: "asthma"} as ChronicDisease
  ]
  const chronicDiseasesNameList: string[] = [
    "diabetes",
    "arthritis",
    "asthma"
  ]
  const cases = [
    {dto: {name:"diabetes" } as CreateChronicDiseaseDto, expectedResult: chronicDiseases[0]},
    {dto: {name:"arthritis" } as CreateChronicDiseaseDto, expectedResult: chronicDiseases[1]},
    {dto: {name:"asthma" } as CreateChronicDiseaseDto, expectedResult: chronicDiseases[2]},
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
    })
    .compile();

    service = module.get<ChronicDiseaseService>(ChronicDiseaseService);
    repository = module.get('ChronicDiseaseRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
  it('should return the list of all chronic diseases', async () => {
    const allChronicDiseases = await repository.find();
    expect(allChronicDiseases.length).toEqual(0);
  });

  it("should create a list of chronic diseases", async () => {
      for(let i=0; i<cases.length; i++) {
        const createdChronicDisease = await repository.create(cases[i].dto);
        const savedDisease = await repository.save(createdChronicDisease);
        expect(savedDisease).toEqual(chronicDiseases[i]);
      }
  });
  
  it("should return a chronic disease given its id", async () => {
      for(let i=0; i<cases.length; i++) {
        const chronicDiseaseById= await repository.findOne({where: {id: chronicDiseases[i].id}});
        expect(chronicDiseaseById).toEqual(chronicDiseases[i]);
      }
  });
  

  it("should find a chronic disease by its name", async () => {
      for(let i=0; i<chronicDiseasesNameList.length; i++) {
        const chronicDiseaseByName = await repository.findOne({where: {name: chronicDiseasesNameList[i]}});
        expect(chronicDiseaseByName).toEqual(chronicDiseases[i]);
      }

  });
  it("should update a chronic disease given its id and new name", async () => {
      const newName = "This is updated Name"
      const disease = await repository.findOne({where: {name: chronicDiseasesNameList[0]}});
      disease.name = newName;
      const saved = await repository.save(disease);
      const diseaseByName = await repository.findOne({where: {name: newName}});
      expect(saved).toEqual(diseaseByName);
  })
  it("should delete a chronic disease given its id", async () => {
    await repository.delete(chronicDiseases[0].id);
    const allChronicDiseases = await repository.find();
    expect(allChronicDiseases.length).toEqual(2);
  });


});