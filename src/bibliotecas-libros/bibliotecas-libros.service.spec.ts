import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecasLibrosService } from './bibliotecas-libros.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/.';
import { LibroService } from '../libro/libro.service';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaService } from '../biblioteca/biblioteca.service';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BibliotecasLibrosService', () => {

  let libroRepository: Repository<LibroEntity>
  let libroList: LibroEntity[] = [];

  let bibliotecaRepository: Repository<BibliotecaEntity>
  let bibliotecaList: BibliotecaEntity[] = [];

  let service: BibliotecasLibrosService;

  const seedBibliotecas = async () => {
    bibliotecaRepository.clear();
    bibliotecaList = [];
    for (let i = 0; i < 5; i++) {
      const biblioteca: BibliotecaEntity = await bibliotecaRepository.save({
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

  const seedLibros = async () => {
    libroRepository.clear();
    libroList = [];
    for (let i = 0; i < 5; i++) {
      const libro: LibroEntity = await libroRepository.save({
        isbn: faker.commerce.isbn(),
        titulo: faker.commerce.productName(),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        bibliotecas: []
      });
      libroList.push(libro);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecasLibrosService, BibliotecaService, LibroService],
    }).compile();

    libroRepository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
    await seedLibros()

    bibliotecaRepository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    await seedBibliotecas()

    service = module.get<BibliotecasLibrosService>(BibliotecasLibrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Add book to library', async () => {
    const libro: LibroEntity = libroList[0];
    const biblioteca: BibliotecaEntity = bibliotecaList[0];
    const result = await service.addBookToLibrary(libro.isbn, biblioteca.id);
    expect(result.libros).toContainEqual(expect.objectContaining({ isbn: libro.isbn }))
  })

  it('Error adding book when it does not exist', async() => {
    const libro: LibroEntity = libroList[0];
    const biblioteca: BibliotecaEntity = bibliotecaList[0];
    libro.isbn = '000000000';
    try {
      await service.addBookToLibrary(libro.isbn, biblioteca.id)
      fail('Expected BusinessLogicException but none was thrown');
    }
    catch (error) {
      expect(error.message).toContain(`El libro con ISBN ${libro.isbn} no existe`);
    }
  })

  it('Find book in library', async () => {
    const libro: LibroEntity = libroList[0];
    const biblioteca: BibliotecaEntity = bibliotecaList[0];
    await service.addBookToLibrary(libro.isbn, biblioteca.id);
    const result = await service.findBookFromLibrary(libro.isbn, biblioteca.id);
    expect(result).not.toBeNull()
    expect(result.isbn).toBe(libro.isbn)
  })

  it('Error when book not in library', async () => {
    const biblioteca: BibliotecaEntity = bibliotecaList[0];
    const libro = libroList[2];
    try {
      await service.findBookFromLibrary(libro.isbn, biblioteca.id)
      fail('Expected BusinessLogicException but none was thrown');
    }
    catch (error) {
      expect(error.message).toContain(`El libro con ISBN ${libro.isbn} no existe en la biblioteca con id ${biblioteca.id}`)
    }
  })

  it('Update books in library', async () => {
    const biblioteca: BibliotecaEntity = bibliotecaList[1];
    await service.updateBooksFromLibrary(biblioteca.id, libroList);
    const result = await service.findBooksFromLibrary(biblioteca.id);
    expect(result).not.toBeNull()
    expect(result.length).toBe(libroList.length)
  })

  it('Update error when book does not exist', async () => {
    const biblioteca: BibliotecaEntity = bibliotecaList[3];
    const libro = libroList[4];
    libro.isbn = '000000000';
    try {
      await service.updateBooksFromLibrary(biblioteca.id, [libro])
      fail('Expected BusinessLogicException but none was thrown');
    }
    catch (error) {
      expect(error.message).toContain(`El libro con ISBN ${libro.isbn} no existe`)
    }
  })

  it('Delete a book from a library', async() => {
    const biblioteca: BibliotecaEntity = bibliotecaList[0];
    const libro: LibroEntity = libroList[0];
    await service.addBookToLibrary(libro.isbn, biblioteca.id);
    await service.deleteBookFromLibrary(biblioteca.id, libro.isbn);

    const updated = await bibliotecaRepository.findOne({
      where: { id: biblioteca.id },
      relations: ['libros']
    });

    expect(updated?.libros.find(l => l.isbn === libro.isbn)).toBeUndefined();
  })

});
