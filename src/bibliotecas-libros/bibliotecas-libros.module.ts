import { Module } from '@nestjs/common';
import { BibliotecasLibrosService } from './bibliotecas-libros.service';
import { BibliotecasLibrosController } from './bibliotecas-libros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from 'src/biblioteca/biblioteca.entity';
import { LibroEntity } from 'src/libro/libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity])],
  providers: [BibliotecasLibrosService],
  exports: [BibliotecasLibrosService],
  controllers: [BibliotecasLibrosController]
})
export class BibliotecasLibrosModule {}
