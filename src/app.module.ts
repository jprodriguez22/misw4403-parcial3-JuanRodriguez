import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BibliotecaModule } from './biblioteca/biblioteca.module';

@Module({
  imports: [BibliotecaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
