import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors/business-errors.interceptor';
import { LibroService } from './libro.service';
import { LibroEntity } from './libro.entity';
import { LibroDTO } from './libro.dto';
import { plainToInstance } from 'class-transformer';


@Controller('books')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
    constructor(private readonly bookService: LibroService){}

    @Get()
    async findAll(): Promise<LibroEntity[]> {
        return await this.bookService.findAll();
    }

    @Get(':id')
    async findOne(@Param('isbn') isbn: string): Promise<LibroEntity> {
        return await this.bookService.findOne(isbn);
    }

    @Post()
    async create(@Body() libroDTO: LibroDTO): Promise<LibroEntity> {
        const libro: LibroEntity = plainToInstance(LibroEntity, libroDTO);
        return await this.bookService.create(libro)
    }

    @Put()
    async update(@Body() libroDTO: LibroDTO): Promise<LibroEntity> {
        const libro: LibroEntity = plainToInstance(LibroEntity, libroDTO);
        return await this.bookService.update(libro, libro.isbn);
    }

    @Delete(':id')
    async delete(@Param('isbn') isbn: string): Promise<void> {
        await this.bookService.delete(isbn);
    }
}
