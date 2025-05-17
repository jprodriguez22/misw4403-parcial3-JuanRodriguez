import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../shared/interceptors/business-errors/business-errors.interceptor';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaDTO } from './biblioteca.dto';
import { plainToInstance } from 'class-transformer';


@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
    constructor(private readonly bibliotecaService: BibliotecaService){}

    @Get()
    async findAll(): Promise<BibliotecaEntity[]> {
        return await this.bibliotecaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<BibliotecaEntity> {
        return await this.bibliotecaService.findOne(id);
    }

    @Post()
    async create(@Body() bibliotecaDTO: BibliotecaDTO): Promise<BibliotecaEntity> {
        const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDTO);
        return await this.bibliotecaService.create(biblioteca)
    }

    @Put()
    async update(@Body() bibliotecaDTO: BibliotecaDTO): Promise<BibliotecaEntity> {
        const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDTO);
        return await this.bibliotecaService.update(biblioteca, biblioteca.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.bibliotecaService.delete(id);
    }
}
