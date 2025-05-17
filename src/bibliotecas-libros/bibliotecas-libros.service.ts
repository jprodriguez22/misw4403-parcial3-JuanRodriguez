import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BibliotecasLibrosService {
    constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,

    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>
  ) { }

  private async getBibliotecaByID(id: number, withRelations: boolean = false): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id },
      relations: withRelations ? ['libros'] : [],
    });
    if (!biblioteca)
      throw new BusinessLogicException(`La biblioteca con id ${id} no existe en el sistema`, BusinessError.NOT_FOUND);
    return biblioteca;
  }

  private async getLibroByISBN(isbn: string, withRelations: boolean = false): Promise<LibroEntity> {
    const pais = await this.libroRepository.findOne({
      where: { isbn },
      relations: withRelations ? ['bibliotecas'] : [],
    });
    if (!pais)
      throw new BusinessLogicException(`El libro con ISBN ${isbn} no existe en el sistema`, BusinessError.NOT_FOUND);
    return pais;
  }

  async addBookToLibrary(isbn: string, id: number): Promise<BibliotecaEntity> {
    const biblioteca = await this.getBibliotecaByID(id, true);
    const libro = await this.getLibroByISBN(isbn, false);

    biblioteca.libros.push(libro);
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async findBooksFromLibrary(id: number): Promise<LibroEntity[]> {
    const biblioteca = await this.getBibliotecaByID(id, true);
    return biblioteca.libros;
  }

  async findBookFromLibrary(isbn: string, id: number): Promise<LibroEntity> {
    const biblioteca = await this.getBibliotecaByID(id, true);
    const bibliotecaLibro: LibroEntity | undefined = biblioteca.libros.find(l => l.isbn === isbn);    
    if (!bibliotecaLibro) {
      throw new BusinessLogicException(`El libro con ISBN ${isbn} no existe en la biblioteca con id ${id}`, BusinessError.NOT_FOUND);
    }
    return bibliotecaLibro;
  }

  async updateBooksFromLibrary(id: number, libros: LibroEntity[]): Promise<BibliotecaEntity> {
    const biblioteca = await this.getBibliotecaByID(id, true);
    for (const libro of libros) {
      const existingLibro = await this.libroRepository.findOne({ where: { isbn: libro.isbn} })
      if (!existingLibro) {
        throw new BusinessLogicException(`El libro con ISBN ${libro.isbn} no existe`, BusinessError.NOT_FOUND);
      }
    }
    biblioteca.libros = libros;
    return await this.bibliotecaRepository.save(biblioteca)
  }

  async deleteBookFromLibrary(idBiblioteca: number, isbn: string): Promise<void> {
    const biblioteca = await this.getBibliotecaByID(idBiblioteca, true);
    await this.getLibroByISBN(isbn, false);

    biblioteca.libros = biblioteca.libros.filter(libro => libro.isbn !== isbn);
    await this.bibliotecaRepository.save(biblioteca)
  }
}
