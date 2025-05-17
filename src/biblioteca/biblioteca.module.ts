import { Module } from '@nestjs/common';
import { BibliotecaEntity } from './biblioteca.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BibliotecaEntity])],
    providers: [BibliotecaService],
    exports: [BibliotecaService],
    controllers: [BibliotecaController]
})
export class BibliotecaModule {}
