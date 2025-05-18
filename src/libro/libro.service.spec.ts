import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { LibroEntity } from './libro.entity';

describe('LibroService', () => {
  let repository: Repository<LibroEntity>;
  let libroList: LibroEntity[] = [];
  let service: LibroService;

  const seedLibros = async () => {
      repository.clear();
      libroList = [];
      for (let i = 0; i < 5; i++) {
        const libro: LibroEntity = await repository.save({
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
      providers: [LibroService],
    }).compile();

    repository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
    service = module.get<LibroService>(LibroService);
    await seedLibros()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('List all books', async () => {
      const result: LibroEntity[] = await service.findAll();
      expect(result).not.toBeNull()
      expect(result.length).toBe(libroList.length);
    })
  
    it('Find a book', async () => {
      const search: LibroEntity = await libroList[0];
      const result: LibroEntity = await service.findOne(search.isbn);
      expect(result).not.toBeNull()
      expect(result.isbn).toBe(search.isbn)
    })
  
    it('Book does not exist', async () => {
      const fakeISBN = '000000000'
      await expect(() => service.findOne(fakeISBN)).rejects.toHaveProperty('message', `El libro con ISBN ${fakeISBN} no existe en el sistema`)
    })
  
    it('Create a new book', async () => {
      const newBook: LibroEntity = {
        isbn: '123456789',
        titulo: faker.commerce.productName(),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.past(),
        bibliotecas: []
      }
      const result: LibroEntity = await service.create(newBook);
      expect(result).not.toBeNull()
      const storedResult: LibroEntity | null = await repository.findOne({ where: { isbn: result.isbn } });
      expect(storedResult).not.toBeNull()
      expect(storedResult!.titulo).toBe(newBook.titulo)
    })
  
    it('Create a new book wrong date', async () => {
      const newBook: LibroEntity = {
        isbn: '123456789',
        titulo: faker.commerce.productName(),
        autor: faker.person.fullName(),
        fechaPublicacion: faker.date.future(),
        bibliotecas: []
      }
      await expect(() => service.create(newBook)).rejects.toHaveProperty('message', `El tiempo de publicación no puede ser mayor a la fecha actual`)
    })
  
    it('Update a book', async () => {
      const bookToUpdate: LibroEntity = libroList[0];
      bookToUpdate.titulo = faker.book.title();
  
      const result: LibroEntity = await service.update(bookToUpdate, bookToUpdate.isbn);
      expect(result).not.toBeNull();
  
      const newBook: LibroEntity | null = await repository.findOne({ where: { isbn: result.isbn } });
      expect(newBook).not.toBeNull();
      expect(newBook!.titulo).toBe(bookToUpdate.titulo);
    })
  
    it('Update a book wrong date', async () => {
      const libraryToUpdate: LibroEntity = libroList[0];
      libraryToUpdate.fechaPublicacion = faker.date.future();
      await expect(() => service.update(libraryToUpdate, libraryToUpdate.isbn)).rejects.toHaveProperty('message', `El tiempo de publicación no puede ser mayor a la fecha actual`)
    })
  
    it('Delete a book', async () => {
      const bookToDelete: LibroEntity = libroList[0];
      await service.delete(bookToDelete.isbn);
  
      const deletedBook: LibroEntity | null = await repository.findOne({ where: { isbn: bookToDelete.isbn } });
      expect(deletedBook).toBeNull();
    })
  
    it('Delete a library that does not exist', async () => {
      const fakeISBN = '999999999'
      await expect(() => service.delete(fakeISBN)).rejects.toHaveProperty('message', `El libro con ISBN ${fakeISBN} no existe en el sistema`)
    })
});
