import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LibroEntity])],
    providers: [LibroService],
    exports: [LibroService],
    controllers: [LibroController]
})
export class LibroModule {}
