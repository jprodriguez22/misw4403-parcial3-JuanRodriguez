import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from 'shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BibliotecaEntity } from './biblioteca.entity';

describe('BibliotecaService', () => {
  let repository: Repository<BibliotecaEntity>;
  let bibliotecaList: BibliotecaEntity[] = [];

  let service: BibliotecaService;

  const seedBibliotecas = async () => {
    repository.clear();
    bibliotecaList = [];
    for (let i = 0; i < 5; i++) {
      const biblioteca: BibliotecaEntity = await repository.save({
        nombre: faker.company.name(),
        direccion: faker.address.streetAddress(),
        ciudad: faker.address.city(),
        horaApertura: '09:00',
        horaCierre: '18:00',
        libros: []
      });
      bibliotecaList.push(biblioteca);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaService],
    }).compile();

    repository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    service = module.get<BibliotecaService>(BibliotecaService);
    await seedBibliotecas()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
