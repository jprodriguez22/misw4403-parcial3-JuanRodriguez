import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { LibroModule } from './libro/libro.module';
import { BibliotecasLibrosModule } from './bibliotecas-libros/bibliotecas-libros.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca/biblioteca.entity';
import { LibroEntity } from './libro/libro.entity';
import { BibliotecaController } from './biblioteca/biblioteca.controller';
import { BibliotecasLibrosController } from './bibliotecas-libros/bibliotecas-libros.controller';
import { LibroController } from './libro/libro.controller';

@Module({
  imports: [
    BibliotecaModule,
    LibroModule,
    BibliotecasLibrosModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'biblioteca',
      dropSchema: true,
      entities: [BibliotecaEntity, LibroEntity],
      synchronize: true,
    })
  ],
  controllers: [AppController,
    BibliotecaController,
    LibroController,
    BibliotecasLibrosController
  ],
  providers: [AppService],
})
export class AppModule { }
