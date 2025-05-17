import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
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
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.city(),
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

  it('List all libraries', async () => {
    const result: BibliotecaEntity[] = await service.findAll();
    expect(result).not.toBeNull()
    expect(result.length).toBe(bibliotecaList.length);
  })

  it('Find a library', async () => {
    const search: BibliotecaEntity = await bibliotecaList[0];
    const result: BibliotecaEntity = await service.findOne(search.id);
    expect(result).not.toBeNull()
    expect(result.id).toBe(search.id)
  })

  it('Library does not exist', async () => {
    const fakeID = 3423656
    await expect(() => service.findOne(fakeID)).rejects.toHaveProperty('message', `La biblioteca con id ${fakeID} no existe en el sistema`)
  })

  it('Create a new library', async () => {
    const newLibrary: BibliotecaEntity = {
      id: 6,
      nombre: faker.company.name(),
      direccion: faker.location.direction(),
      ciudad: faker.location.city(),
      horaApertura: '09:00',
      horaCierre: '18:00',
      libros: []
    }
    const result: BibliotecaEntity = await service.create(newLibrary);
    expect(result).not.toBeNull()
    const storedResult: BibliotecaEntity | null = await repository.findOne({ where: { id: result.id } });
    expect(storedResult).not.toBeNull()
    expect(storedResult!.nombre).toBe(newLibrary.nombre)
  })

  it('Create a new library wrong time format', async () => {
    const newLibrary: BibliotecaEntity = {
      id: 7,
      nombre: faker.company.name(),
      direccion: faker.location.direction(),
      ciudad: faker.location.city(),
      horaApertura: '09',
      horaCierre: '11',
      libros: []
    }
    await expect(() => service.create(newLibrary)).rejects.toHaveProperty('message', `El tiempo de apertura debe estar entre 0:00 y 23:59 horas`)
  })

  it('Create a new library closing time before opening time', async () => {
    const newLibrary: BibliotecaEntity = {
      id: 7,
      nombre: faker.company.name(),
      direccion: faker.location.direction(),
      ciudad: faker.location.city(),
      horaApertura: '09:00',
      horaCierre: '04:00',
      libros: []
    }
    await expect(() => service.create(newLibrary)).rejects.toHaveProperty('message', `El tiempo de apertura debe ser menor al de cierre`)
  })

  it('Update a library', async () => {
    const libraryToUpdate: BibliotecaEntity = bibliotecaList[0];
    libraryToUpdate.nombre = faker.company.name();

    const result: BibliotecaEntity = await service.update(libraryToUpdate, libraryToUpdate.id);
    expect(result).not.toBeNull();

    const newLibrary: BibliotecaEntity | null = await repository.findOne({ where: { id: result.id } });
    expect(newLibrary).not.toBeNull();
    expect(newLibrary!.nombre).toBe(libraryToUpdate.nombre);
  })

  it('Update a library wrong time format', async () => {
    const libraryToUpdate: BibliotecaEntity = bibliotecaList[0];
    libraryToUpdate.horaApertura = "09"
    await expect(() => service.update(libraryToUpdate, libraryToUpdate.id)).rejects.toHaveProperty('message', `El tiempo de apertura debe estar entre 0:00 y 23:59 horas`)
  })

  it('Update a library closing time before opening time', async () => {
    const libraryToUpdate: BibliotecaEntity = bibliotecaList[0];
    libraryToUpdate.horaApertura = '09:00'
    libraryToUpdate.horaCierre = '05:00'
    await expect(() => service.update(libraryToUpdate, libraryToUpdate.id)).rejects.toHaveProperty('message', `El tiempo de apertura debe ser menor al de cierre`)
  })

  it('Delete a library', async () => {
    const libraryToDelete: BibliotecaEntity = bibliotecaList[0];
    await service.delete(libraryToDelete.id);

    const deletedLibrary: BibliotecaEntity | null = await repository.findOne({ where: { id: libraryToDelete.id } });
    expect(deletedLibrary).toBeNull();
  })

  it('Delete a library that does not exist', async () => {
    const fakeID = 342
    await expect(() => service.delete(fakeID)).rejects.toHaveProperty('message', `La biblioteca con id ${fakeID} no existe en el sistema`)
  })

});

