import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors/business-errors.interceptor';
import { BibliotecasLibrosService } from './bibliotecas-libros.service';
import { LibroEntity } from 'src/libro/libro.entity';
import { BibliotecaEntity } from 'src/biblioteca/biblioteca.entity';
import { LibroDTO } from 'src/libro/libro.dto';
import { plainToInstance } from 'class-transformer';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecasLibrosController {
    constructor(private readonly service: BibliotecasLibrosService){}

    @Post(':id/books/:isbn')
    async addBookToLibrary(@Param('id') id: number, @Param('isbn') isbn: string): Promise<BibliotecaEntity> {
        return await this.service.addBookToLibrary(isbn, id)
    }

    @Get(':id/books')
    async findBooksFromLibrary(@Param('id') id: number): Promise<LibroEntity[]> {
        return await this.service.findBooksFromLibrary(id)
    }

    @Get(':id/books/:isbn')
    async findBookFromLibrary(@Param('id') id: number, @Param('isbn') isbn: string): Promise<LibroEntity> {
        return await this.service.findBookFromLibrary(isbn, id);
    }

    @Put(':id/books')
    async updateBooksFromLibrary(@Param('id') id: number, @Body() librosDTO: LibroDTO[]): Promise<BibliotecaEntity> {
        const libros = plainToInstance(LibroEntity, librosDTO)
        return await this.service.updateBooksFromLibrary(id, libros)
    }

    @Delete(':id/books/:isbn')
    async deleteBookFromLibrary(@Param('id') id: number, @Param('isbn') isbn: string): Promise<void> {
        await this.service.deleteBookFromLibrary(id, isbn)
    }
}