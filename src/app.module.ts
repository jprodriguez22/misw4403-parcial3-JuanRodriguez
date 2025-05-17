import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { LibroModule } from './libro/libro.module';
import { BibliotecasLibrosModule } from './bibliotecas-libros/bibliotecas-libros.module';

@Module({
  imports: [BibliotecaModule, LibroModule, BibliotecasLibrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
